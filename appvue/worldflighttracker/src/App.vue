<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { isLoggedIn, logout } from './auth';

export default {
  name: 'App',
  methods: {
    isLoggedIn,
    logout,
  },
};
</script>

<style>
/* Imposta l'altezza della pagina per coprire l'intera finestra */
html, body, #app {
  height: 100%;
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>