<template>
  <v-app>
    <v-main class="pa-0">
      <RouterView></RouterView>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style>
/* Override any remaining constraints */
.v-application {
  width: 100% !important;
  max-width: none !important;
}

.v-application__wrap {
  min-height: 100vh !important;
  max-width: none !important;
}

.v-main {
  padding: 0 !important;
}

.v-main__wrap {
  width: 100% !important;
  max-width: none !important;
}

/* Hide the theme toggle buttons at the bottom */
.v-btn--icon,
.v-theme--light__toggle,
.v-theme--dark__toggle,
.v-bottom-navigation {
  display: none !important;
}
</style>
