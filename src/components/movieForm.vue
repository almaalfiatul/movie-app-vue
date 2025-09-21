<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 text-white">
    <!-- Title -->
    <h2 class="text-2xl font-bold text-red mb-4 flex justify-center">
        {{ form?.id ? "Edit Movie" : "Add Movie" }}
    </h2>
    <div>
      <label class="block mb-1 text-sm">Title</label>
      <input
        v-model="form.title"
        type="text"
        placeholder="Enter movie title"
        class="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-red-600"
        required
      />
    </div>

    <!-- Director -->
    <div>
      <label class="block mb-1 text-sm">Director</label>
      <input
        v-model="form.directors"
        type="text"
        placeholder="Enter director name"
        class="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-red-600"
      />
    </div>

    <!-- Actors -->
    <div>
      <label class="block mb-1 text-sm">Actors</label>
      <input
        v-model="form.actors"
        type="text"
        placeholder="Enter director name"
        class="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-red-600"
      />
    </div>

    <!-- Country -->
    <div>
      <label class="block mb-1 text-sm">Country</label>
      <input
        v-model="form.country"
        type="text"
        placeholder="Enter country name"
        class="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-red-600"
      />
    </div>

    <!-- Cover Link -->
    <div>
      <label class="block mb-1 text-sm">Cover Link</label>
      <input
        v-model="form.cover_link"
        type="url"
        placeholder="https://example.com/image.jpg"
        class="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-red-600"
      />
    </div>

    <!-- Trailer Link -->
    <div>
      <label class="block mb-1 text-sm">Trailer Link</label>
      <input
        v-model="form.trailer_link"
        type="url"
        placeholder="https://example.com/image.jpg"
        class="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-red-600"
      />
    </div>

    <!-- Duration -->
    <div>
      <label class="block mb-1 text-sm">Duration (minutes)</label>
      <input
        v-model="form.duration"
        type="number"
        min="1"
        placeholder="Duration (minutes)"
        class="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-red-600"
      />
    </div>

    <!-- Year -->
    <div>
      <label class="block mb-1 text-sm">Year</label>
      <input
        v-model="form.year"
        type="number"
        min="1"
        placeholder="Year"
        class="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-red-600"
      />
    </div>

    <!-- Summary -->
    <div>
      <label class="block mb-1 text-sm">Summary</label>
      <textarea
        v-model="form.notes"
        rows="3"
        placeholder="Enter movie summary"
        class="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-red-600"
      ></textarea>
    </div>

    <!-- Genres -->
    <div class="p-4 bg-gray-900 rounded">
      <label class="text-white mb-2 block">Select Genres</label>
      <div class="flex gap-2 flex-wrap">
        <button v-for="genre in availableGenres" :key="genre" type="button"
                @click="toggleGenre(genre)"
                :class="[
                  'px-2 py-1 rounded transition-colors text-xs duration-200',
                  selectedGenres.includes(genre)
                    ? 'bg-red-600 text-white scale-105'
                    : 'bg-black text-white hover:scale-105'
                ]">
          {{ genre }}
        </button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-4 flex gap-2 flex justify-center">
      <button type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Save
      </button>
      <button type="button" @click="$emit('cancel')"
              class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(["save", "cancel"]);
console.log(props.modelValue, 'val');

// Reactive form
const form = reactive({
  title: props.modelValue.title || "",
  directors: props.modelValue.directors || "",
  actors: props.modelValue.actors || "",
  country: props.modelValue.country || "",
  cover_link: props.modelValue.cover_link || "",
  trailer_link: props.modelValue.trailer_link || "",
  duration: props.modelValue.duration || "",
  year: props.modelValue.year || "",
  notes: props.modelValue.notes || "",
  id: props.modelValue.id || "",
});

// Hardcoded genre list
const availableGenres = [
  "Action","Comedy","Drama","Horror","Sci-Fi","Crime","Thriller","War",
  "Animation", "Romantic", "Biography", "Western"
];

// Selected genres
const selectedGenres = ref([]);

// Initialize selected genres
function initSelectedGenres() {
  const genreData = props.modelValue?.genre;
  if (Array.isArray(genreData)) {
    selectedGenres.value = [...genreData];
  } else if (typeof genreData === "string" && genreData.trim() !== "") {
    // ubah string menjadi array
    selectedGenres.value = [genreData];
  } else {
    selectedGenres.value = [];
  }
}

// Jalankan saat mount
onMounted(() => {
  console.log("Mounted props.modelValue:", props.modelValue.genre);

  initSelectedGenres()
});

// Watch props berubah (misal edit dari API)
watch(
  () => props.modelValue,
  () => {
    form.title = props.modelValue.title || "";
    // ... update field lain
    initSelectedGenres(); // gunakan fungsi ini
  },
  { immediate: true, deep: true }
);

// Toggle genre
function toggleGenre(genre) {
  if (selectedGenres.value.includes(genre)) {
    selectedGenres.value = selectedGenres.value.filter(g => g !== genre);
  } else {
    selectedGenres.value.push(genre);
  }
}

function generateRandomId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return Number(`${timestamp}${random}`);
}

// Submit
function handleSubmit() {
  const payload = {
    ...form,
    genre: selectedGenres.value,
    id: generateRandomId(),
  };
  emit("save", payload);
}
</script>