import { useQuery } from "@tanstack/vue-query";
import { api } from "@/api/axios";
import { ref } from 'vue';

const errorDetails = ref('');
const responseDebug = ref<any>(null);

const fetchHello = async (): Promise<string> => {
  try {
    // Hacer la petición y guardar la respuesta completa para depuración
    const response = await api.get('/hello');
    responseDebug.value = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    };
    console.log('Respuesta completa:', response);
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener hello:', error);
    errorDetails.value = error.message || 'Error desconocido';
    throw error;
  }
};

const useHello = () => {
  const { data, isError, isFetching, error, refetch } = useQuery({ 
    queryKey: ['hello'], 
    queryFn: fetchHello, 
    initialData: "",
    retry: 1
  });
  
  return { 
    hello: data, 
    isHelloError: isError, 
    isHelloFetching: isFetching, 
    errorDetails, 
    responseDebug,
    error,
    refetch 
  };
};

export default useHello;
