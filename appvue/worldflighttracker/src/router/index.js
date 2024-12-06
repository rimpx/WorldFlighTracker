import { createRouter, createWebHistory } from 'vue-router';
import { isLoggedIn } from '../auth'; // Ora isLoggedIn è esportato correttamente

import HomeView from '../views/HomeView.vue';
import SuccessPage from '../views/SuccessPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/success',
    name: 'Success',
    component: SuccessPage,
    meta: { requiresAuth: true }  // Indica che la rotta richiede autenticazione
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Aggiungi un controllo globale per la protezione delle rotte
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    // Se la rotta richiede autenticazione e l'utente non è autenticato, reindirizza alla home
    next('/');
  } else {
    // Procedi alla rotta successiva
    next();
  }
});

export default router;