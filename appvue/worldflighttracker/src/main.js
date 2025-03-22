import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { googleTokenLogin } from 'vue3-google-login'; // Importa il metodo corretto

const app = createApp(App);

app.use(router);

// Inizializza il plugin correttamente
googleTokenLogin({
  clientId: '564606231029-f491m38591t9i831cntsg6jjhdp2vter.apps.googleusercontent.com'
});

app.mount('#app');
