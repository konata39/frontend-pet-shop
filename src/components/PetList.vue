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
</template>

<script setup>
import { ref, computed } from "vue";
import Card from "../components/Card.vue";
import { usePokemonStore } from "../providers/PokemonProvider.vue";
const offset = ref(0);
const isLoading = ref(false);
const sidebarVisible = ref(false);
const cryAudio = ref(null);
const defaultCry = new URL("../assets/pokemon_sound.mp3", import.meta.url).href;
const lowHealthCry = new URL("../assets/low_health.mp3", import.meta.url).href;
const lowHappinessCry = new URL("../assets/low_happiness.mp3", import.meta.url).href;

const selectedId = ref(null);
const { state, updateHealth, updateHappiness, initPokemon } = usePokemonStore();

function playDefaultCry() {
  cryAudio.value.src = defaultCry;
  cryAudio.value.play();
}

function playCry(id) {
  const pokemon = state[id];
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
  Object.keys(state)
    .map((id) => Number(id))
    .filter((id) => !Number.isNaN(id))
);

const selectedName = computed(() =>
  selectedId.value !== null && state[selectedId.value]
    ? state[selectedId.value].name
    : ''
);

const selectedImage = computed(() =>
  selectedId.value !== null && state[selectedId.value]
    ? state[selectedId.value].image
    : ''
);

const selectedDetail = computed(() =>
  selectedId.value !== null && state[selectedId.value]
    ? state[selectedId.value].detail
    : ''
);

const selectedHealth = computed(() =>
  selectedId.value !== null && state[selectedId.value]
    ? state[selectedId.value].health
    : 0
);

const selectedHappiness = computed(() =>
  selectedId.value !== null && state[selectedId.value]
    ? state[selectedId.value].happiness
    : 0
);
async function getPokeAPI() {
  isLoading.value = true;
  try {
    const listRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset.value}`);
    const listData = await listRes.json();

    const fetchPromises = listData.results.map(async (item) => {
      const pokeRes = await fetch(item.url);
      const pokeData = await pokeRes.json();

      const APIUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokeData.id}/`;
      initPokemon(pokeData.id, {
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
  const pokemon = state[id];
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
      initPokemon(id, { detail: detailText });
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
  const currentHealth = state[selectedId.value].health;
  updateHealth(selectedId.value, Math.min(currentHealth + 10, 100));
}

function recoverHappiness() {
  if (selectedId.value === null) return;
  const currentHappiness = state[selectedId.value].happiness;
  updateHappiness(selectedId.value, Math.min(currentHappiness + 10, 100));
}
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
.close-tab {
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
@keyframes animateright {
  0% {right:-300px; opacity: 0;}
  100% {right:0; opacity:1;}
}
</style>
