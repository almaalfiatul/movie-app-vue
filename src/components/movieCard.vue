<template>
  <div
    class="relative w-full rounded-xl overflow-hidden shadow-lg bg-gray-800 hover:scale-105 transition-transform cursor-pointer"
  >
    <img
      :src="movie.cover_link"
      :alt="movie.title"
      class="w-full h-64 object-cover"
    />
    <div class="p-2 text-white text-sm truncate">
      {{ movie.title }}
    </div>
    <div class="absolute bottom-2 left-2 flex space-x-2">
      <span class="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded">HD</span>
      <span
        class="bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded flex items-center space-x-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 6v6l4 2" />
        </svg>
        <span>{{ movie.duration }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  movie: {
    type: Object,
    required: true,
  },
});
</script>
