<template>
<audio ref="cryAudio"></audio>
<div v-if="isLoading" class="loading">載入中...</div>
<div v-else id="card-container" class="card-container">
      <Card
        v-for="id in cardIds"
        :key="id"
        :id="id"
        @select="detailOpen"
        @cry="playCry"
      />
    </div>
    <div class="button-container">
      <button @click="getPokeAPI">GET new PET!</button>
    </div>
    <div class="detail-sidebar" v-show="sidebarVisible">
      <button class="close-tab" @click="detailClose">Close &times;</button>
      <div class="detail-content">
        <h2>{{ selectedName }}</h2>
        <img v-if="selectedImage" :src="selectedImage" :alt="selectedName" />
        <p>{{ selectedDetail }}</p>
        <p class="status-display">
          健康值：{{ selectedHealth }} / 100
        </p>
        <p class="status-display">
          快樂值：{{ selectedHappiness }} / 100
        </p>
      <button class="recover-btn" @click="recoverHealth">
        餵食寶可夢
      </button>
      <button class="recover-btn" @click="recoverHappiness">
        跟寶可夢玩
      </button>
      <button class="cry-btn" @click="playDefaultCry">
        播放叫聲
      </button>
      </div>
    </div>
    <div class="event-panel" :class="{ active: eventVisible }">
      <p>{{ eventMessage }}</p>
      <div class="event-buttons">
        <button @click="respondToEvent(true)">是</button>
        <button @click="respondToEvent(false)">否</button>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import Card from "../components/Card.vue";
import { usePetStore } from "../stores/pet.js";
const offset = ref(0);
const isLoading = ref(false);
const sidebarVisible = ref(false);
const cryAudio = ref(null);
const defaultCry = new URL("../assets/pokemon_sound.mp3", import.meta.url).href;
const lowHealthCry = new URL("../assets/low_health.mp3", import.meta.url).href;
const lowHappinessCry = new URL("../assets/low_happiness.mp3", import.meta.url).href;

const selectedId = ref(null);
const { pets, updateHealth, updateHappiness, updateHunger, initPet } = usePetStore();

function playDefaultCry() {
  cryAudio.value.src = defaultCry;
  cryAudio.value.play();
}

function playCry(id) {
  const pokemon = pets[id];
  if (!pokemon) return;
  let src = defaultCry;
  if (pokemon.health < 60) {
    src = lowHealthCry;
  } else if (pokemon.happiness < 60) {
    src = lowHappinessCry;
  }
  cryAudio.value.src = src;
  cryAudio.value.play();
}

const cardIds = computed(() =>
  Object.keys(pets)
    .map((id) => Number(id))
    .filter((id) => !Number.isNaN(id))
);

const selectedName = computed(() =>
  selectedId.value !== null && pets[selectedId.value]
    ? pets[selectedId.value].name
    : ''
);

const selectedImage = computed(() =>
  selectedId.value !== null && pets[selectedId.value]
    ? pets[selectedId.value].image
    : ''
);

const selectedDetail = computed(() =>
  selectedId.value !== null && pets[selectedId.value]
    ? pets[selectedId.value].detail
    : ''
);

const selectedHealth = computed(() =>
  selectedId.value !== null && pets[selectedId.value]
    ? pets[selectedId.value].health
    : 0
);

const selectedHappiness = computed(() =>
  selectedId.value !== null && pets[selectedId.value]
    ? pets[selectedId.value].happiness
    : 0
);

const eventVisible = ref(false);
const eventMessage = ref("\\");
let eventAction = null;
let eventTimer = null;

async function getPokeAPI() {
  isLoading.value = true;
  try {
    const listRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset.value}`);
    const listData = await listRes.json();

    const fetchPromises = listData.results.map(async (item) => {
      const pokeRes = await fetch(item.url);
      const pokeData = await pokeRes.json();

      const APIUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokeData.id}/`;
      initPet(pokeData.id, {
        name: pokeData.name,
        image: pokeData.sprites.front_default,
        detail: '',
        detailUrl: APIUrl,
      });
    });

    await Promise.all(fetchPromises);
    offset.value += listData.results.length;
  } catch (err) {
    console.error(err);
    alert('Error on get API data!');
  } finally {
    isLoading.value = false;
  }
}

async function detailOpen(id) {
  selectedId.value = id;
  sidebarVisible.value = true;
  const pokemon = pets[id];
  if (pokemon && !pokemon.detail) {
    try {
      const speciesRes = await fetch(pokemon.detailUrl);
      const speciesData = await speciesRes.json();
      const entry = speciesData.flavor_text_entries.find(
        (e) => e.language.name === 'zh-Hant'
      );
      const detailText = entry
        ? entry.flavor_text.replace(/\s+/g, '')
        : '無中文介紹';
      initPet(id, { detail: detailText });
    } catch (err) {
      console.error(err);
    }
  }
}

function detailClose() {
  selectedId.value = null;
  sidebarVisible.value = false;
}

function recoverHealth() {
  if (selectedId.value === null) return;
  const currentHealth = pets[selectedId.value].health;
  updateHealth(selectedId.value, Math.min(currentHealth + 10, 100));
}

function recoverHappiness() {
  if (selectedId.value === null) return;
  const currentHappiness = pets[selectedId.value].happiness;
  updateHappiness(selectedId.value, Math.min(currentHappiness + 10, 100));
}

function triggerRandomEvent() {
  if (eventVisible.value) return;
  const ids = cardIds.value;
  if (!ids.length) return;
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  const pet = pets[randomId];
  const type = ["health", "happiness", "hunger"][Math.floor(Math.random() * 3)];
  if (type === "health") {
    updateHealth(randomId, pet.health - 10);
    eventMessage.value = `${pet.name} 生病了，要餵藥嗎？`;
    eventAction = () => updateHealth(randomId, Math.min(pet.health + 10, 100));
  } else if (type === "happiness") {
    updateHappiness(randomId, pet.happiness - 10);
    eventMessage.value = `${pet.name} 心情不好，要安撫嗎？`;
    eventAction = () =>
      updateHappiness(randomId, Math.min(pet.happiness + 10, 100));
  }
  eventVisible.value = true;
  clearTimeout(eventTimer);
  eventTimer = setTimeout(() => respondToEvent(false), 5000);
}

function respondToEvent(accepted) {
  if (accepted && typeof eventAction === "function") {
    eventAction();
  }
  eventVisible.value = false;
  eventAction = null;
  clearTimeout(eventTimer);
}

watchEffect((onCleanup) => {
  if (!cardIds.value.length) return;
  const interval = setInterval(triggerRandomEvent, 60000);
  onCleanup(() => clearInterval(interval));
});
</script>

<style scoped>
.card-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  background-color: #F5F5F5;
  align-content: flex-start;
  padding: 20px;
  box-sizing: border-box;
  justify-items: center;
}

@media (max-width: 640px) {
  .card-container {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  }
}

.button-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.button-container button,
.recover-btn,
.cry-btn,
.close-tab,
.event-panel button {
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #222;
  color: #fff;
  border: none;
  border-radius: 4px;
}
.cry-btn,
.recover-btn {
  margin-top: 10px;
}

.close-tab {
  margin: 10px;
}
.loading {
  text-align: center;
  margin: 20px 0;
}
.detail-sidebar{
  height:100%;
  width:200px;
  top: 0;
  background-color: #fff;
  position: fixed !important;
  z-index: 1;
  right:0px;
  box-shadow:0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
  animation: animateright 0.4s;
}
.event-panel {
  position: fixed;
  top: 20px;
  left: -320px;
  width: 300px;
  background-color: #fff;
  padding: 20px;
  box-shadow:0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
  transition: left 0.3s;
  z-index: 2000;
}

.event-panel.active {
  left: 20px;
}

.event-buttons {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
@keyframes animateright {
  0% {right:-300px; opacity: 0;}
  100% {right:0; opacity:1;}
}
</style>
