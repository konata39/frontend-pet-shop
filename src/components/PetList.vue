length<template>
<div id="card-container" class="card-container">
      <Card
        v-for="(card, idx) in cards"
        :key="card.name + idx"
        :name="card.name"
        :image="card.image"
        :detail="card.detail"
        @select="detailOpen"
      />
    </div>
    <div class="button-container">
      <button @click="getPokeAPI">GET new PET!</button>
    </div>
    <div id="right-menu" class="detail-sidebar" v-show="sidebarVisible">
      <button class="closeTab" @click="detailClose()">Close &times;</button>
      <div id="display-block" class="detail-content">
        {{ selectedDetail }}
      </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import Card from "../components/Card.vue";
const cards = ref([]);
const length = ref(0);
const sidebarVisible = ref(false);
const selectedDetail = ref('');
async function getPokeAPI() {
  length.value++;
  try {
    const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${length.value}/`);
    const pokeData = await pokeRes.json();
    const name = pokeData.name;
    const image = pokeData.sprites.front_default;

    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${length.value}/`);
    const speciesData = await speciesRes.json();
    const entry = speciesData.flavor_text_entries.find(e => e.language.name === 'zh-Hant');
    const detailText = entry
      ? entry.flavor_text.replace(/\s+/g, '')
      : '無中文介紹';

    cards.value.push({ name, image, detail: detailText });
  } catch (err) {
    console.error(err);
    alert('Error on get API data!');
  }
}

async function detailOpen(petName) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${petName}/`);
    const data = await res.json();
    const entry = data.flavor_text_entries.find(e => e.language.name === 'zh-Hant');
    selectedDetail.value = entry
      ? entry.flavor_text.replace(/\s+/g, '')
      : '無中文介紹';
  } catch {
    selectedDetail.value = 'Fetch detail failed';
  }
  sidebarVisible.value = true;
}

function detailClose() {
  sidebarVisible.value = false;
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
