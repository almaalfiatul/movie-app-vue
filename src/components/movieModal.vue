
<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
  >
    <div class="bg-gray-900 rounded-lg w-full max-w-lg p-6 relative shadow-lg max-h-[90vh] overflow-y-auto">
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
      >
        ✕
      </button>

      <!-- Terima movie dari parent -->
      <MovieForm
        :modelValue="movie"
        @save="$emit('save', $event)"
        @cancel="$emit('close')"
      />
    </div>
  </div>
</template>
<script setup>
import MovieForm from "./movieForm.vue";

defineProps({
  show: Boolean,
  movie: Object, // ganti modelValue menjadi movie
});
defineEmits(["close", "save"]);
</script>

