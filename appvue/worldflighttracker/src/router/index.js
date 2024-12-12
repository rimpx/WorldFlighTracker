import { createRouter, createWebHistory } from 'vue-router';
import { isLoggedIn } from '../auth'; // Funzione che verifica se l'utente è loggato

import HomeView from '../views/HomeView.vue';
import SuccessPage from '../views/SuccessPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    beforeEnter: (to, from, next) => {
      if (isLoggedIn()) {
        next('/success');  // Se l'utente è già loggato, lo reindirizza alla success page
      } else {
        next();  // Altrimenti, procedi con la visualizzazione della home page
      }
    },
  },
  {
    path: '/success',
    name: 'Success',
    component: SuccessPage,
    meta: { requiresAuth: true }, // La pagina di successo richiede l'autenticazione
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Proteggi le rotte che richiedono autenticazione
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/'); // Se la rotta richiede autenticazione e l'utente non è autenticato, torna alla home
  } else {
    next(); // Altrimenti, procedi
  }
});

export default router;