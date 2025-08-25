import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const usePetStore = defineStore('pet', () => {
  const pets = reactive({});

  function initPet(id, data = {}) {
    if (!pets[id]) {
      pets[id] = {
        name: '',
        image: '',
        detail: '',
        detailUrl: '',
        health: 60,
        happiness: 60,
        hunger: 0,
        ...data,
      };
    } else {
      Object.assign(pets[id], data);
    }
  }

  function updateHealth(id, health) {
    initPet(id);
    pets[id].health = Math.min(Math.max(health, 0), 100);
  }

  function updateHappiness(id, happiness) {
    initPet(id);
    pets[id].happiness = Math.min(Math.max(happiness, 0), 100);
  }

  function updateHunger(id, hunger) {
    initPet(id);
    pets[id].hunger = Math.min(Math.max(hunger, 0), 100);
  }

  return {
    pets,
    initPet,
    updateHealth,
    updateHappiness,
    updateHunger,
  };
});
