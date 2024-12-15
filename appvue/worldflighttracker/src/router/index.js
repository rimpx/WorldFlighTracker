import { createRouter, createWebHistory } from 'vue-router';
import { isLoggedIn } from '../auth'; // Funzione che verifica se l'utente è loggato

import HomeView from '../views/HomeView.vue';
import SuccessPage from '../views/SuccessPage.vue';
import AccountPage from '../views/AccountPage.vue'; // Importa la nuova pagina ACCOUNT

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    beforeEnter: (to, from, next) => {
      if (isLoggedIn()) {
        next('/success'); // Se l'utente è già loggato, reindirizza alla success page
      } else {
        next(); // Procedi con la home
      }
    },
  },
  {
    path: '/success',
    name: 'Success',
    component: SuccessPage,
    meta: { requiresAuth: true }, // La pagina di successo richiede autenticazione
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountPage,
    meta: { requiresAuth: true }, // La pagina account richiede autenticazione
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Proteggi le rotte che richiedono autenticazione
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/'); // Se non autenticato, reindirizza alla home
  } else {
    next(); // Altrimenti, procedi con la navigazione
  }
});

export default router;