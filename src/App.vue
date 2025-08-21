<template>
  <div id="app">
    <Banner />
    <BackgroundMusic />
    <PetList />
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import Banner from "./components/Banner.vue";
import PetList from "./components/PetList.vue";
import { providePokemonStore } from "./providers/PokemonProvider.vue";
import BackgroundMusic from "./components/BackgroundMusic.vue";
</script>
