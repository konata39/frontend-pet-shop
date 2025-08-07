<template>
<div id="card-container" class="card-container">
      <Card
        v-for="(card, idx) in cards"
        :key="card.name + idx"
        :id="card.id"
        :name="card.name"
        :image="card.image"
        :detail="card.detail"
        :health="card.health"
        :happiness="card.happiness"
        @select="detailOpen"
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
      </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import Card from "../components/Card.vue";
const cards = ref([]);
const length = ref(0);
const sidebarVisible = ref(false);

const selectedId = ref(null);
const selectedName = ref('');
const selectedImage = ref('');
const selectedDetail = ref('');
const selectedHealth = ref(0);
const selectedHappiness = ref(0);
async function getPokeAPI() {
  length.value++;
  try {
    const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${length.value}/`);
    //const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0`);
    const pokeData = await pokeRes.json();
    //console.log(pokeData.results[0]);
    const name = pokeData.name;
    const image = pokeData.sprites.front_default;

    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${length.value}/`);
    const speciesData = await speciesRes.json();
    const entry = speciesData.flavor_text_entries.find(e => e.language.name === 'zh-Hant');
    const detailText = entry
      ? entry.flavor_text.replace(/\s+/g, '')
      : '無中文介紹';

    cards.value.push({ id: length.value, name, image, detail: detailText, health: 0, happiness: 0 });
  } catch (err) {
    console.error(err);
    alert('Error on get API data!');
  }
}

async function detailOpen(id) {
  selectedId.value = id;
  try {
    const card = cards.value.find(c => c.id === id);
    if (card) {
      selectedHealth.value = card.health;
      selectedHappiness.value = card.happiness;
    }
    const pokeRes  = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const pokeData = await pokeRes.json();
    selectedName.value  = pokeData.name;
    selectedImage.value = pokeData.sprites.front_default;

    const speciesRes  = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    const speciesData = await speciesRes.json();
    const entry = speciesData.flavor_text_entries.find(e => e.language.name === 'zh-Hant');
    selectedDetail.value = entry
      ? entry.flavor_text.replace(/\s+/g, '')
      : '無中文介紹';

  } catch (err) {
    console.error(err);
    selectedDetail.value = 'Fetch detail failed';
  }
  sidebarVisible.value = true;
}

function detailClose() {
  selectedId.value = null;
  sidebarVisible.value = false;
}

function recoverHealth() {
  if (selectedId.value === null) return;

  const newHealth = Math.min(selectedHealth.value + 10, 100);
  selectedHealth.value = newHealth;

  const card = cards.value.find(c => c.id === selectedId.value);
  if (card) {
    card.health = newHealth;
  }
}

function recoverHappiness() {
  if (selectedId.value === null) return;

  const newHappiness = Math.min(selectedHappiness.value + 10, 100);
  selectedHappiness.value = newHappiness;

  const card = cards.value.find(c => c.id === selectedId.value);
  if (card) {
    card.happiness = newHappiness;
  }
}
</script>

<style scoped>
.card-container {
  width: 100%;
  height: 1750px;
  display: flex;
  flex-wrap: wrap;
  background-color: #bbb;
  align-content: flex-start;
  padding-bottom: 20px;
  box-sizing: border-box;
}

.button-container {
  text-align: center;
  margin: 20px 0;
}

.button-container button {
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
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
