<template>
  <nav class="bg-black/60 backdrop-blur-sm mt-3 px-6 py-4">
    <div class="container mx-auto flex items-center justify-between">
      <div class="flex items-center gap-6">
        <router-link to="/" class="text-2xl font-bold text-red-500">
          Alma<span class="text-white">Hub</span>
        </router-link>
      </div>
      <div class="container mx-auto flex justify-center">
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          type="text"
          placeholder="Search movies by title..."
          class="rounded-[8px] px-4 py-2 w-full h-[35px] ml-20 mr-20 text-black"
        />
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps({
    modelValue: String
  });
  const emit = defineEmits(["update:modelValue"]);
</script>
