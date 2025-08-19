<template>
  <slot />
</template>

<script>
import { reactive, provide, inject } from 'vue';

const PokemonStoreSymbol = Symbol('PokemonStore');

export function usePokemonStore() {
  const store = inject(PokemonStoreSymbol);
  if (!store) {
    throw new Error('PokemonStore is not provided');
  }
  return store;
}

export default {
  setup() {
    const pokemons = reactive([]);

    function addPokemons(list) {
      pokemons.push(...list);
    }

    function updatePokemon(id, data) {
      const pokemon = pokemons.find((p) => p.id === id);
      if (pokemon) {
        Object.assign(pokemon, data);
      }
    }

    const store = {
      pokemons,
      addPokemons,
      updatePokemon,
    };

    provide(PokemonStoreSymbol, store);
  },
};
</script>
