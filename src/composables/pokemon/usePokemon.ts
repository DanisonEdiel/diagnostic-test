import { ref, watch, computed } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import apiClient from '@/api/axios';
import type { Pokemon, PokemonDetail, PokemonListResponse } from '@/models/Pokemon';

const fetchPokemons = async (): Promise<PokemonListResponse> => {
  const { data } = await apiClient.get<PokemonListResponse>('/pokemon', {
    params: {
      limit: 20,
      offset: 0
    }
  });
  return data;
};

const fetchPokemonDetails = async (nameOrId: string | number): Promise<PokemonDetail> => {
  const { data } = await apiClient.get<PokemonDetail>(`/pokemon/${nameOrId}`);
  return data;
};

const fetchPokemonsByUrl = async (url: string): Promise<PokemonListResponse> => {
  const { data } = await apiClient.get<PokemonListResponse>(url);
  return data;
};

export function usePokemon() {
  const queryClient = useQueryClient();
  const selectedPokemonId = ref<string | number | null>(null);
  const nextUrl = ref<string | null>(null);
  const previousUrl = ref<string | null>(null);
  
  const isLoadingState = ref<boolean>(false);
  const errorState = ref<string | null>(null);
  const pokemonResults = ref<Pokemon[]>([]);

  const { 
    data: pokemonListData, 
    isLoading: isLoadingList, 
    isError: isErrorList, 
    error: errorList,
    refetch: refetchPokemonList
  } = useQuery({
    queryKey: ['pokemons'],
    queryFn: fetchPokemons
  });

  watch(pokemonListData, (newList) => {
    if (newList) {
      nextUrl.value = newList.next;
      previousUrl.value = newList.previous;
      pokemonResults.value = newList.results;
    }
  });

  const { 
    data: pokemonDetailData, 
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    error: errorDetail,
    refetch: refetchPokemonDetail
  } = useQuery({
    queryKey: ['pokemon', selectedPokemonId],
    queryFn: () => {
      if (!selectedPokemonId.value) throw new Error('No Pokemon selected');
      return fetchPokemonDetails(selectedPokemonId.value);
    },
    enabled: !!selectedPokemonId.value
  });

  watch([isLoadingList, isLoadingDetail], ([newLoadingList, newLoadingDetail]) => {
    isLoadingState.value = newLoadingList || newLoadingDetail;
  });

  watch([isErrorList, isErrorDetail, errorList, errorDetail], ([newErrorList, newErrorDetail, newErrorListMsg, newErrorDetailMsg]) => {
    if (newErrorList && newErrorListMsg) {
      errorState.value = String(newErrorListMsg);
    } else if (newErrorDetail && newErrorDetailMsg) {
      errorState.value = String(newErrorDetailMsg);
    } else {
      errorState.value = null;
    }
  });

  const pokemons = computed<Pokemon[]>(() => pokemonResults.value);
  const selectedPokemon = computed<PokemonDetail | undefined>(() => pokemonDetailData.value);

  const loadNextPage = async () => {
    if (nextUrl.value) {
      try {
        isLoadingState.value = true;
        errorState.value = null;
        
        // Usamos directamente la URL completa
        const data = await fetchPokemonsByUrl(nextUrl.value);
        
        // Actualizamos los resultados directamente
        pokemonResults.value = data.results;
        
        // Actualizamos las URLs de paginación
        nextUrl.value = data.next;
        previousUrl.value = data.previous;
        
        // Actualizamos la caché de Vue Query
        queryClient.setQueryData(['pokemons'], data);
        
        isLoadingState.value = false;
        return data.results;
      } catch (error) {
        isLoadingState.value = false;
        errorState.value = error instanceof Error ? error.message : 'Error loading next page';
        console.error('Error loading next page:', error);
        throw error;
      }
    }
    return [];
  };

  const loadPreviousPage = async () => {
    if (previousUrl.value) {
      try {
        isLoadingState.value = true;
        errorState.value = null;
        
        // Usamos directamente la URL completa
        const data = await fetchPokemonsByUrl(previousUrl.value);
        
        // Actualizamos los resultados directamente
        pokemonResults.value = data.results;
        
        // Actualizamos las URLs de paginación
        nextUrl.value = data.next;
        previousUrl.value = data.previous;
        
        // Actualizamos la caché de Vue Query
        queryClient.setQueryData(['pokemons'], data);
        
        isLoadingState.value = false;
        return data.results;
      } catch (error) {
        isLoadingState.value = false;
        errorState.value = error instanceof Error ? error.message : 'Error loading previous page';
        console.error('Error loading previous page:', error);
        throw error;
      }
    }
    return [];
  };

  const getPokemonDetails = (nameOrId: string | number) => {
    selectedPokemonId.value = nameOrId;
    // Forzamos la recarga de los detalles
    refetchPokemonDetail();
  };

  const clearSelectedPokemon = () => {
    selectedPokemonId.value = null;
  };

  return {
    pokemons,
    selectedPokemon,
    loading: isLoadingState,
    error: errorState,
    nextUrl,
    previousUrl,
    getPokemons: refetchPokemonList,
    getPokemonDetails,
    loadNextPage,
    loadPreviousPage,
    clearSelectedPokemon
  };
}