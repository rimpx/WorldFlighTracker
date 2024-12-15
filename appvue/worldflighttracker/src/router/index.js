import { createRouter, createWebHistory } from 'vue-router';
import { isLoggedIn } from '../auth'; // Funzione che verifica se l'utente è loggato

import HomeView from '../views/HomeView.vue';
import SuccessPage from '../views/SuccessPage.vue';
import AccountPage from '../views/AccountPage.vue';
import AdminPage from '../views/AdminPage.vue'; // Importa la nuova pagina admin

// Verifica se l'utente è admin in base al flag isAdmin
function isAdmin() {
  return sessionStorage.getItem("isAdmin") === "true";
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    beforeEnter: (to, from, next) => {
      if (isLoggedIn()) {
        next(isAdmin() ? '/admin' : '/success'); // Controlla il ruolo dell'utente
      } else {
        next(); // Procedi con la home
      }
    },
  },
  {
    path: '/success',
    name: 'Success',
    component: SuccessPage,
    meta: { requiresAuth: true }, // La pagina success richiede autenticazione
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountPage,
    meta: { requiresAuth: true }, // La pagina account richiede autenticazione
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true }, // Solo per admin
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Proteggi le rotte che richiedono autenticazione e ruolo admin
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/'); // Se non autenticato, reindirizza alla home
  } else if (to.meta.requiresAdmin && !isAdmin()) {
    console.log("Non admin, reindirizzamento a success");
    next('/success'); // Se non admin, reindirizza alla pagina di successo
  } else {
    next(); // Altrimenti, procedi con la navigazione
  }
});

export default router;