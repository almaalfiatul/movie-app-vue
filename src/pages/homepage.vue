<template>
  <div>
    <Hero />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
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
          <section class="mb-12" v-if="!props.searchQuery">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-white">New</h2>
              <router-link 
                to="/movies" 
                class="text-gray-400 hover:text-white flex items-center gap-1"
              >
                View all →
              </router-link>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-10">
              <router-link 
                v-for="m in (newMovies?.slice(0, 4) || [])" 
                :key="m.year" 
                :to="`/detail-movie/${m.id}`" 
                class="text-gray-400 hover:text-white"
              >
                <MovieCard :movie="m" class="w-full h-90 object-cover rounded-lg" />

              </router-link>
            </div>
          </section>
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
                v-for="m in (searchResults?.slice(0, 4) || [])" 
                :key="m.id" 
                :to="`/detail-movie/${m.id}`" 
                class="text-gray-400 hover:text-white"
              >
                <MovieCard :movie="m" class="w-full h-90 object-cover rounded-lg" />

              </router-link>
            </div>
          </section>
        </div>
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
  const searchQuery = ref("");

  const fetchMovies = async () => {
    try {
      const data = await getMovies(); 
      movies.value = data || []; 
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      movies.value = [];
    }
  };

  const props = defineProps({
    searchQuery: String
  });

  onMounted(async () => {
    movies.value = (await getMovies()) || [];
  });

  const newMovies = computed(() => {
    return movies.value
      .slice()
      .sort((a, b) => b.year - a.year)
      .slice(0, 4);
  });
  
  const searchResults = computed(() => { 
    const query = (props.searchQuery || "").trim().toLowerCase();
    if (!query) return movies.value;

    const filtered = movies.value.filter(
      (m) => m?.title?.toLowerCase().includes(query)
    );
    return Array.from(new Map(filtered.map(m => [m.id, m])).values());
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

  async function handleDelete(id) {
    await deleteMovie(id);
    await fetchMovies();
    editing.value = null;
  }
</script>

<style>
  .container { max-width: 1600px; }
</style>
