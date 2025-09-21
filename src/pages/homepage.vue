<template>
  <div>
    <Hero />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Content utama -->
        <div class="flex-1">
          <button
            @click="openNew"
            class="bg-red-600 mb-10 text-white px-4 py-2 rounded"
          >
            + Add Movie
          </button>

          <MovieModal 
            :show="showModal"
            :modelValue="editing"
            @close="closeModal"
            @save="handleSave"
          />

          <!-- Movies Collection -->
          <section class="mb-12">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-white">Movies Collection</h2>
              <router-link 
                to="/movies" 
                class="text-gray-400 hover:text-white flex items-center gap-1"
              >
                View all →
              </router-link>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-10">
              <router-link 
                v-for="m in (filtered?.slice(0, 4) || [])" 
                :key="m.id" 
                :to="`/detail-movie/${m.id}`" 
                class="text-gray-400 hover:text-white"
              >
                <MovieCard :movie="m" class="w-full h-90 object-cover rounded-lg" />

              </router-link>
            </div>
          </section>

          <!-- Genre -->
          <!-- <section class="mb-12">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-white">Genre:</h2>
              <button class="text-gray-400 hover:text-white flex items-center gap-1">
                View all → 
              </button>
            </div>
            <div class="flex gap-4 overflow-x-auto pb-2">
              <div
                v-for="movie in genreMovies"
                :key="movie.id"
                class="w-40 sm:w-48 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden relative"
              >
                <img
                  :src="movie.cover_link"
                  alt=""
                  class="w-full h-56 sm:h-64 object-cover"
                />
                <div class="absolute bottom-2 left-2 flex gap-2">
                  <span class="bg-red-600 text-xs text-white px-2 py-0.5 rounded">HD</span>
                  <span class="bg-gray-700 text-xs text-white px-2 py-0.5 rounded">{{ movie.label }}</span>
                </div>
                <div class="p-2">
                  <h3 class="text-sm font-medium text-white truncate">{{ movie.title }}</h3>
                </div>
              </div>
            </div>
          </section> -->

          <!-- New Release -->
          <!-- <section>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-white">New Release - Series</h2>
              <button class="text-gray-400 hover:text-white flex items-center gap-1">
                View all → 
              </button>
            </div>
            <div class="flex gap-4 overflow-x-auto pb-2">
              <div
                v-for="series in newSeries"
                :key="series.id"
                class="w-40 sm:w-48 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden relative"
              >
                <img
                  :src="series.image"
                  alt=""
                  class="w-full h-56 sm:h-64 object-cover"
                />
                <div class="absolute bottom-2 left-2 flex gap-2">
                  <span class="bg-red-600 text-xs text-white px-2 py-0.5 rounded">HD</span>
                  <span class="bg-gray-700 text-xs text-white px-2 py-0.5 rounded">{{ series.label }}</span>
                </div>
                <div class="p-2">
                  <h3 class="text-sm font-medium text-white truncate">{{ series.title }}</h3>
                </div>
              </div>
            </div>
          </section> -->
        </div>

        <!-- Sidebar Form Editing -->
        <div class="w-full lg:w-1/3" v-if="editing">
          <MovieForm
            :modelValue="editing"
            @save="handleSave"
            @deleteMovie="handleDelete"
            @cancel="closeForm"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from "vue";
  import Hero from "../components/hero.vue";
  import MovieCard from "../components/movieCard.vue";
  import MovieForm from "../components/movieForm.vue";
  import MovieModal from "../components/movieModal.vue";
  import { getMovies, createMovie, updateMovie, deleteMovie } from "../firebaseService";
  import Swal from "sweetalert2";

  const movies = ref([]);
  const editing = ref(null);
  const showModal = ref(false);

  // Fetch movies dari Firebase
  const fetchMovies = async () => {
    try {
      const data = await getMovies(); // harus return array
      movies.value = data || [];      // guard kalau data null/undefined
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      movies.value = [];
    }
  };

  const props = defineProps({
    searchQuery: String  // terima dari App.vue
  });

  onMounted(async () => {
    movies.value = (await getMovies()) || [];
  });

  const filtered = computed(() => {
    if (!props.searchQuery) return movies.value;
    return movies.value.filter(m =>
      m.title.toLowerCase().includes(props.searchQuery.toLowerCase())
    );
  });

  function openNew() {
    editing.value = {
      id: null,
      title: "",
      directors: "",
      note: "",
      genre: [],
      cover_link: "",
      trailer_link: "",
      duration: "",
      country: "",
      year: "",
      actors: ""
    };
    showModal.value = true;
  }

  function closeModal() {
    showModal.value = false;
    editing.value = null;
  }

  // Open form untuk edit movie
  function openEdit(movie) {
    editing.value = { ...movie };
  }

  async function handleSave(payload) {
    try {
      if (!payload.id) {
        await createMovie(payload);
        Swal.fire("Sukses!", "Movie berhasil ditambahkan.", "success");
      } else {
        await updateMovie(payload.id, payload);
        Swal.fire("Sukses!", "Movie berhasil diperbarui.", "success");
      }
      await fetchMovies();
      closeModal();
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Gagal menyimpan movie.", "error");
    }
  }


  // Delete movie
  async function handleDelete(id) {
    await deleteMovie(id);
    await fetchMovies();
    editing.value = null;
  }

  // Close form
  function closeForm() {
    editing.value = null;
  }
</script>

<style>
  .container { max-width: 1600px; }
</style>
