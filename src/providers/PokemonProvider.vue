<script>
import { reactive, readonly, provide, inject } from 'vue';

export const PokemonStatusSymbol = Symbol('PokemonStatus');

function createPokemonStore() {
  const state = reactive({});

  function initPokemon(id, data = {}) {
    if (!state[id]) {
      state[id] = {
        name: '',
        image: '',
        detail: '',
        health: 0,
        happiness: 0,
        ...data,
      };
    } else {
      Object.assign(state[id], data);
    }
  }

  function updateHealth(id, health) {
    initPokemon(id);
    state[id].health = Math.min(Math.max(health, 0), 100);
  }

  function updateHappiness(id, happiness) {
    initPokemon(id);
    state[id].happiness = Math.min(Math.max(happiness, 0), 100);
  }

  return {
    state: readonly(state),
    initPokemon,
    updateHealth,
    updateHappiness,
  };
}

export function providePokemonStore(app) {
  const store = createPokemonStore();
  if (app && typeof app.provide === 'function') {
    app.provide(PokemonStatusSymbol, store);
  } else {
    provide(PokemonStatusSymbol, store);
  }
  return store;
}

export function usePokemonStore() {
  const store = inject(PokemonStatusSymbol);
  if (!store) {
    throw new Error('usePokemonStore must be used after providePokemonStore');
  }
  return store;
}

export default {};
</script>
