<template>
  <div>
    <Navbar v-if="showNavbar" 
      :modelValue="searchQuery" 
      @update:modelValue="searchQuery = $event" />
    <router-view :search-query="searchQuery" />
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import Navbar from './components/Navbar.vue';
  import { useRoute } from "vue-router";
  import { RouterView } from 'vue-router';

  const route = useRoute();
  const searchQuery = ref(""); 
  const showNavbar = computed(() => !route.path.startsWith("/detail-movie"));
</script>
