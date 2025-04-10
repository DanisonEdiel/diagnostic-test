<script setup lang="ts">
// NotFoundView.vue - Clean 404 error page
</script>

<template>
  <div class="not-found-wrapper">
    <v-card class="mx-auto pa-6 text-center" max-width="500" elevation="3">
      <v-card-title class="text-h1 primary--text font-weight-bold">404</v-card-title>
      <v-card-title class="text-h4 mb-2">Página no encontrada</v-card-title>
      <v-card-text class="text-body-1 mb-6">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </v-card-text>
      <v-btn color="primary" to="/" variant="elevated" size="large">
        Volver al inicio
      </v-btn>
    </v-card>
  </div>
</template>

<style>
.not-found-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Override any Vuetify constraints */
.v-application,
.v-application__wrap,
.v-main,
.v-main__wrap,
.v-container,
.v-sheet {
  width: 100% !important;
  max-width: none !important;
  padding: 0 !important;
  margin: 0 !important;
  background-color: #f8f9fa !important;
}

/* Hide any buttons at the bottom */
.v-theme--light__toggle,
.v-theme--dark__toggle,
.v-bottom-navigation,
.v-btn--icon {
  display: none !important;
}
</style>
