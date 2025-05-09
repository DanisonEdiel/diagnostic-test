<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useHello from '@/composables/pokemon/useHello';

const { hello, isHelloError, isHelloFetching, errorDetails, responseDebug, error, refetch } = useHello();
const helloText = ref<string>('');

// Forzar una recarga al montar el componente
onMounted(() => {
  refetch();
});

// Función para hacer una petición directa sin Vue Query
const fetchDirectly = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/hello');
    const text = await response.text();
    console.log('Respuesta directa:', response);
    console.log('Contenido de la respuesta:', text);
    helloText.value = text;
  } catch (err) {
    console.error('Error en fetch directo:', err);
  }
};
</script>

<template>
  <div class="debug-container">
    <h2>Prueba de API</h2>
    
    <div class="response-section">
      <h3>Respuesta de Vue Query:</h3>
      <div v-if="isHelloFetching">Cargando...</div>
      <div v-else-if="isHelloError" class="error">
        <p>Error: {{ error?.message }}</p>
        <p>Detalles: {{ errorDetails }}</p>
      </div>
      <div v-else>
        <p><strong>Contenido recibido:</strong> "{{ hello }}"</p>
        <pre v-if="responseDebug" class="debug-info">{{ JSON.stringify(responseDebug, null, 2) }}</pre>
      </div>
      <button @click="() => refetch()">Recargar con Vue Query</button>
    </div>
    
    <div class="response-section">
      <h3>Prueba directa con Fetch:</h3>
      <p v-if="helloText"><strong>Contenido recibido:</strong> "{{ helloText }}"</p>
      <button @click="fetchDirectly">Probar con Fetch directo</button>
    </div>
  </div>
</template>

<style lang="css" scoped>
.debug-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.response-section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error {
  color: red;
}

.debug-info {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
  font-size: 12px;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>