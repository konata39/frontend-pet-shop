<template>
  <div id="app">
    <Banner />
    <PetList />
  </div>
</template>

<script setup>
import Banner from "./components/Banner.vue";
import PetList from "./components/PetList.vue";
import { providePokemonStore } from "./providers/PokemonProvider.vue";
</script>
