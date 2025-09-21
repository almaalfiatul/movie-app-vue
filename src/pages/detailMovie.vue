<template>
  <div class="container mx-auto px-6 py-8 text-white">
    <!-- Loading guard -->
    <div v-if="!movie" class="text-center text-white py-20">
      Loading movie...
    </div>
    <div v-else>
      <!-- Video Player -->
      <div class="mb-6 relative">
        <iframe 
          :src="movie.trailer_link" 
          class="w-full h-[400px] rounded-lg"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <!-- Movie Info -->
      <div class="flex flex-col md:flex-row gap-6 mb-8">
        <!-- Poster -->
        <img 
          :src="movie.cover_link" 
          alt="poster" 
          class="w-48 md:w-64 rounded-lg"
        />

        <!-- Details -->
        <div class="flex-1 space-y-2">
          <div class="flex justify-between items-start">
            <h1 class="text-3xl font-bold">{{ movie.title }}</h1>
            <button 
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              @click="openEdit(movie)"
              title="Edit Movie"
            >
              Edit Movie
            </button>
          </div>

          <!-- Genre, Year, Duration, Rating -->
          <div class="flex flex-wrap items-center gap-2">
            <span v-for="g in movie.genres" :key="g" class="bg-gray-700 px-2 py-1 rounded text-sm">
              {{ g }}
            </span>
            <span class="text-sm">{{ movie.year }}</span>
            <span class="text-sm">{{ movie.duration }} min</span>
            <span class="text-sm">⭐ {{ movie.rating || "N/A" }}</span>
          </div>

          <!-- Summary -->
          <p class="mt-2">{{ movie.notes || movie.description }}</p>

          <!-- Additional info -->
          <div class="text-sm space-y-1 mt-2">
            <p><strong>Country:</strong> {{ movie.country }}</p>
            <p><strong>Genre:</strong> 
              <div class="px-3 py-1 rounded text-sm inline-block">
                {{ Array.isArray(movie.genre) 
                  ? movie.genre.join(", ") 
                  : movie.genre }}
              </div>
            </p>
            <p><strong>Production:</strong> {{ movie.directors || "N/A" }}</p>
            <p><strong>Cast:</strong> {{ movie.actors }}</p>
          </div>
        </div>
      </div>

      <!-- You may also like -->
      <div v-if="recommended.length" class="mt-12">
        <h2 class="text-xl font-semibold mb-4">You may also like</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-10">
          <router-link 
            v-for="m in recommended" 
            :key="m.id" 
            :to="`/detail-movie/${m.id}`"
          >
            <MovieCard :movie="m"
            class="w-full h-90 object-cover rounded-lg" />
          </router-link>
        </div>
      </div>

      <div class="fixed bottom-0 left-0 w-full flex items-center justify-center">
        <div class="absolute w-full h-[80px] bg-black"></div>
        <button
          @click="$router.back()"
          class="relative z-10 px-6 py-2 bg-red-600 hover:bg-gray-600 
                rounded shadow text-white font-semibold"
        >
          ← Back
        </button>
      </div>
    </div>
  </div>
  <!-- Modal edit -->
  <MovieModal
    :show="showModal"
    :movie="editing"
    @close="closeModal"
    @save="handleSaved"
    @refresh="loadMovies"
  />
</template>

<script setup>
  import { ref, onMounted, computed, watch } from "vue";
  import { useRoute } from "vue-router";
  import { getMovies, updateMovie } from "../firebaseService";
  import MovieCard from "../components/movieCard.vue";
  import MovieModal from "../components/movieModal.vue";
  import Swal from "sweetalert2";
  import { useRouter } from "vue-router";
  import { nextTick } from "vue";
  const router = useRouter();
  const route = useRoute();
  const movie = ref(null);
  const movies = ref([]);
  const editing = ref(null);
  const showModal = ref(false);
  const emit = defineEmits(['save']);

  async function loadMovies() {
    if (!movies.value.length) {
      movies.value = await getMovies() || [];
    }
    const id = route.params.id;
    movie.value = movies.value.find(m => String(m.id) === id) || null;
  }

  // Load awal
  onMounted(async () => {
    await loadMovies();
  });

  // Watch perubahan route id
  watch(
    () => route.params.id,
    () => {
      loadMovies();
    }
  );

    function openEdit(movie) {
      editing.value = { ...movie };
      console.log(editing.value, 'editing');
      showModal.value = true;
    }

    function closeModal() {
      showModal.value = false;
      editing.value = null;
      window.location.reload();
    }

    async function handleSaved(payload) {
      try {
        if (!payload.id) {
          await createMovie(payload);
          Swal.fire("Sukses!", "Movie berhasil ditambahkan.", "success");
        } else {
          await updateMovie(payload.id, payload);
          Swal.fire("Sukses!", "Movie berhasil diperbarui.", "success");
        }
        await loadMovies();
        closeModal();
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Gagal menyimpan movie.", "error");
      }
    }

  // Recommended movies
  const recommended = computed(() => {
    if (!movie.value) return [];
    return movies.value.filter(m => m.id !== movie.value.id).slice(0, 8);
  });
</script>
