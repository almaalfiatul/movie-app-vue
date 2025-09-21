
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// ⬅️ pakai relative path (lebih aman di Vite/Stackblitz)
import HomePage from '../pages/homepage.vue'
import MovieList from '../pages/moviesList.vue'
import DetailMovie from '../pages/detailMovie.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/movies', name: 'MovieList', component: MovieList },
  {
    path: "/detail-movie/:id", 
    name: "Detail",
    component: DetailMovie,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
