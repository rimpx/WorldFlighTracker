import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createGoogleAuth } from 'vue3-google-login';


createApp(App).use(router).use(
    createGoogleAuth({
      clientId: "564606231029-f491m38591t9i831cntsg6jjhdp2vter.apps.googleusercontent.com", // Usa il tuo Client ID
    })
  ).mount('#app')
