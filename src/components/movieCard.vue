<template>
  <div class="relative bg-gray-800 rounded-lg overflow-hidden">
    <!-- Poster -->
    <router-link :to="`/detail-movie/${movie.id}`">
      <img
        :src="movie.cover_link"
        :alt="movie.title"
        class="w-full h-60 md:h-72 lg:h-80 object-cover rounded-t-lg"
      />
    </router-link>

    <!-- Title + HD + Duration -->
    <div class="p-2 bg-black bg-opacity-50 text-white">
      <!-- Title -->
      <div class="font-semibold text-sm truncate">{{ movie.title }}</div>
      
      <!-- HD & Duration -->
      <div class="flex gap-2 mt-1 text-xs">
        <span class="bg-red-600 px-1.5 py-0.5 rounded">HD</span>
        <span class="bg-gray-700 px-1.5 py-0.5 rounded flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2" />
          </svg>
          {{ movie.duration }} min
        </span>
      </div>
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
