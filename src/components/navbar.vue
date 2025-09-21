<!-- <template>
  <nav class="bg-black/60 backdrop-blur-sm px-6 py-4">
    <div class="container mx-auto flex items-center justify-between">
      <div class="flex items-center gap-6">
        <div class="text-2xl font-bold text-red-500">Movie<span class="text-white">Hub</span></div>
        <ul class="hidden md:flex gap-4 text-gray-300">
          <li>Home</li>
          <li>Genre</li>
          <li>Country</li>
        </ul>
      </div> -->


<template>
  <nav class="bg-black/60 backdrop-blur-sm px-6 py-4">
    <div class="container mx-auto flex items-center justify-between">
      <div class="flex items-center gap-6">
        <div class="text-2xl font-bold text-red-500">Movie<span class="text-white">Hub</span></div>
        <ul class="hidden md:flex gap-4 text-gray-300">
          <li>Home</li>
          <li>Genre</li>
          <li>Country</li>
        </ul>
      </div>
      <div class="container mx-auto flex justify-end">
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          type="text"
          placeholder="Search movies..."
          class="rounded-full px-4 py-2 w-72 text-black"
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
