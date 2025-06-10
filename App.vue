<template>
  <div id="app">
    <Banner />
    <div class="cardContainer">
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
      <button @click="getPokeAPI()">GET new PET!</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Banner from "./components/Banner.vue";
import Card from "./components/Card.vue";
const cards = ref([]);
const counter = ref(0);
const sidebarVisible = ref(false);
const selectedDetail = ref("");
async function getPokeAPI() {
  counter.value += 1;
  const id = counter.value;

  try {
    const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    if (!resp.ok) throw new Error("Pokemon fetch failed");
    const data = await resp.json();

    const name = data.name;
    const image = data.sprites.front_default || "";

    const speciesResp = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${id}/`
    );
    if (!speciesResp.ok) throw new Error("Species fetch failed");
    const speciesData = await speciesResp.json();

    const zhEntry = speciesData.flavor_text_entries.find(
      (obj) => obj.language.name === "zh-Hant"
    );
    const detailText = zhEntry
      ? zhEntry.flavor_text.replace(/\s+/g, "")
      : "無中文介紹";

    cards.value.push({
      name,
      image,
      detail: detailText,
    });
  } catch (err) {
    console.error(err);
    alert("Error on get API data!");
  }
}

async function detailOpen(name) {

  const found = cards.value.find((c) => c.name === name);
  if (found) {
    selectedDetail.value = found.detail;
    sidebarVisible.value = true;
  }
}
</script>

<style>
#app {
  margin: 0;
  padding: 0;
  font-family: "Noto Sans TC", sans-serif;
}

.cardContainer {
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
</style>
