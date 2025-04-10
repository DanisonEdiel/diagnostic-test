<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { usePokemon } from '@/composables/pokemon/usePokemon';
import apiClient from '@/api/axios';
import type { Pokemon, PokemonListResponse } from '@/models/Pokemon';

const {
  pokemons,
  selectedPokemon,
  loading,
  error,
  nextUrl,
  previousUrl,
  getPokemons,
  getPokemonDetails,
  loadNextPage,
  loadPreviousPage,
  clearSelectedPokemon
} = usePokemon();

const searchQuery = ref<string>('');
const isSearching = ref<boolean>(false);
const searchResults = ref<Pokemon[]>([]);
const searchLoading = ref<boolean>(false);
const searchError = ref<string | null>(null);

onMounted(async () => {
  await getPokemons();
});
watch(
  searchQuery,
  (newQuery) => {
    handleSearch();
  },
  { immediate: false }
);

let searchTimeout: number | null = null;
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = window.setTimeout(() => {
    performSearch(searchQuery.value);
    searchTimeout = null;
  }, 300);
};

const performSearch = async (query: string) => {
  if (!query.trim()) {
    isSearching.value = false;
    searchResults.value = [];
    await getPokemons();
    return;
  }
  
  isSearching.value = true;
  searchLoading.value = true;
  searchError.value = null;
  
  try {
    const response = await apiClient.get<PokemonListResponse>('/pokemon', {
      params: {
        limit: 100
      }
    });
    searchResults.value = response.data.results.filter((pokemon: Pokemon) => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    searchLoading.value = false;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to search Pokemon';
    searchError.value = errorMessage;
    searchLoading.value = false;
    console.error('Error searching Pokemon:', err);
  }
};

const handleGetPokemonDetails = (nameOrId: string | number) => {
  getPokemonDetails(nameOrId);
};

const handleLoadNextPage = async () => {
  try {
    const results = await loadNextPage();
    if (results && results.length > 0) {
      isSearching.value = false;
      searchResults.value = [];
    }
  } catch (err) {
    console.error('Error loading next page:', err);
  }
};

const handleLoadPreviousPage = async () => {
  try {
    const results = await loadPreviousPage();
    if (results && results.length > 0) {
      isSearching.value = false;
      searchResults.value = [];
    }
  } catch (err) {
    console.error('Error loading previous page:', err);
  }
};

const getPokemonIdFromUrl = (url: string): string => {
  if (!url) return '';
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 2];
};

const formatPokemonName = (name: string | undefined): string => {
  if (!name) return '';
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const selectedPokemonDetails = computed(() => {
  const pokemonData = selectedPokemon.value;
  if (!pokemonData) return null;
  
  return {
    id: pokemonData.id,
    name: pokemonData.name,
    height: pokemonData.height,
    weight: pokemonData.weight,
    types: pokemonData.types,
    abilities: pokemonData.abilities,
    sprites: pokemonData.sprites
  };
});

const displayedPokemons = computed<Pokemon[]>(() => {
  return isSearching.value ? searchResults.value : pokemons.value;
});

const isLoading = computed<boolean>(() => {
  return loading.value || searchLoading.value;
});

const displayError = computed<string | null>(() => {
  return error.value || searchError.value;
});

const isPreviousDisabled = computed<boolean>(() => {
  return isLoading.value || !previousUrl.value || isSearching.value;
});

const isNextDisabled = computed<boolean>(() => {
  return isLoading.value || !nextUrl.value || isSearching.value;
});
</script>
<template>
  <div class="pa-2">
    <h1>Pokémon API Explorer</h1>
    <v-container>
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card>
            <v-card-title>Search Pokemon 👀</v-card-title>
            <v-card-text>
              <v-text-field v-model="searchQuery" label="Pokemon Name" prepend-inner-icon="mdi-magnify"
                 clearable @input="handleSearch"></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col :cols="selectedPokemonDetails ? 9 : 12">
          <v-card>
            <v-card-title class="d-flex align-center">
              <span>Pokemon List</span>
              <v-spacer></v-spacer>
              <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
            </v-card-title>

            <v-card-text v-if="displayError">
              <v-alert type="error" title="Error" :text="displayError"></v-alert>
            </v-card-text>

            <v-card-text v-if="!isLoading && displayedPokemons.length > 0">
              <v-row>
                <v-col v-for="(pokemon, index) in displayedPokemons" :key="index" cols="12" sm="6" md="4" lg="3">
                  <v-card class="mx-auto pokemon-card" @click="handleGetPokemonDetails(pokemon.name)" hover>
                    <v-img
                      :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromUrl(pokemon.url)}.png`"
                      height="150" class="mx-auto" contain></v-img>
                    <v-card-title class="text-center">{{ formatPokemonName(pokemon.name) }}</v-card-title>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text v-if="!isLoading && displayedPokemons.length === 0">
              <v-alert type="info" text="No se encontraron Pokémon. Intenta con otra búsqueda."></v-alert>
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" variant="flat" :disabled="isPreviousDisabled" @click="handleLoadPreviousPage">
                Previous
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="flat" :disabled="isNextDisabled" @click="handleLoadNextPage">
                Next
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col v-if="selectedPokemonDetails" cols="3">
          <v-card class="h-100">
            <v-card-title class="text-h5">{{ formatPokemonName(selectedPokemonDetails.name) }}</v-card-title>
            
            <v-img
              :src="selectedPokemonDetails.sprites?.other?.['official-artwork']?.front_default || selectedPokemonDetails.sprites?.front_default"
              height="200" contain class="mx-auto"></v-img>
            
            <v-card-text>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>ID: {{ selectedPokemonDetails.id }}</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>Height: {{ selectedPokemonDetails.height / 10 }} m</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>Weight: {{ selectedPokemonDetails.weight / 10 }} kg</v-list-item-title>
                </v-list-item>
              </v-list>

              <div class="mt-2">
                <strong>Types:</strong>
                <div class="d-flex flex-wrap">
                  <v-chip v-for="(type, index) in selectedPokemonDetails.types" :key="index" class="ma-1" color="primary"
                    text-color="white" size="small">
                    {{ formatPokemonName(type.type.name) }}
                  </v-chip>
                </div>
              </div>

              <div class="mt-2">
                <strong>Abilities:</strong>
                <div class="d-flex flex-wrap">
                  <v-chip v-for="(ability, index) in selectedPokemonDetails.abilities" :key="index" class="ma-1"
                    color="secondary" text-color="white" size="small">
                    {{ formatPokemonName(ability.ability.name) }}
                  </v-chip>
                </div>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" variant="flat" @click="clearSelectedPokemon" block>
                Back to list
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>

.pokemon-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: none;
}

.h-100 {
  height: 100%;
}
</style>
