<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="full-layout">
    <v-container fluid class="pa-0">
      <RouterView />
    </v-container>
  </div>
</template>

<style scoped>
.full-layout {
  min-height: 100vh;
  width: 100%;
  background-color: #f8f9fa;
}
</style>
