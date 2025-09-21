<template>
  <main class="mx-auto px-6 sm:px-10 md:px-16 lg:px-26 pb-20 py-8 max-w-[1400px]">
    <div class="flex items-center justify-between mb-10">
      <h1 class="text-2xl font-bold text-white">All Movies</h1>
      <button
        @click="openNew"
        class="bg-red-600 text-white px-4 py-2 rounded flex"
      >
        + Add Movie
      </button>
    </div>

    <MovieModal 
      :show="showModal"
      :modelValue="editing"
      @close="closeModal"
      @save="handleSaved"
    />
    <!-- Daftar Movie -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-[50px] mb-8">
      <div 
        v-for="movie in paginatedMovies" 
        :key="movie.id"
        class="relative bg-gray-800 rounded-lg overflow-hidden"
      >
        <div class="relative w-full rounded-lg overflow-hidden">
          <!-- Poster -->
          <router-link :to="`/detail-movie/${movie.id}`">
            <img
              :src="movie.cover_link"
              :alt="movie.title"
              class="w-full h-48 md:h-56 lg:h-60 object-cover rounded-lg"
            />
          </router-link>

          <!-- Overlay kiri: HD & Duration -->
          <div class="absolute top-2 left-2 flex space-x-2 z-10">
            <span class="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded">HD</span>
            <span class="bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6l4 2" />
              </svg>
              <span>{{ movie.duration }} min</span>
            </span>
          </div>

          <!-- Overlay kanan: Edit & Delete -->
          <div class="absolute top-1.5 right-2 flex space-x-2 z-10">
            <!-- Tombol edit -->
            <button
              @click="openEdit(movie)"
              class="bg-black bg-opacity-70 text-xs text-white px-3 py-1 rounded-md shadow hover:bg-red-700"
              title="Edit Movie"
            >
              ✏️ Edit
            </button>
            <!-- Tombol delete -->
            <button
              @click="confirmDelete(movie.id)"
              class="bg-black bg-opacity-70 text-xs text-white px-3 py-1 rounded-md shadow hover:bg-red-700"
              title="Delete Movie"
            >
              🗑️ Delete
            </button>
          </div>

          <!-- Title di bawah poster -->
          <div class="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-sm p-2 truncate z-10">
            {{ movie.title }}
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center space-x-2 text-white">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded bg-gray-700 disabled:opacity-50"
      >
        Prev
      </button>

      <span>Page {{ currentPage }} of {{ totalPages }}</span>

      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded bg-gray-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
    <div class="fixed bottom-0 left-0 w-full flex items-center justify-center">
      <div class="absolute w-full h-[80px] bg-black"></div>
      <button
        @click="goBack"
        class="relative z-10 px-6 py-2 bg-red-600 hover:bg-gray-600 
              rounded shadow text-white font-semibold"
      >
        ← Back
      </button>
    </div>
  </main>
  <!-- Modal edit -->
  <MovieModal
    :show="showModal"
    :movie="editing"
    @close="closeModal"
    @save="handleSave"
    @refresh="loadMovies"
  />
</template>

<script setup>
  import { ref, computed, onMounted } from "vue";
  import MovieModal from "../components/movieModal.vue";
  import { getMovies, updateMovie, deleteMovie } from "../firebaseService";
  import Swal from "sweetalert2";
  import { useRouter } from "vue-router";

  const router = useRouter();

  function goBack() {
    router.back();
  }

  const props = defineProps({
    movies: { type: Array, required: true },
    searchQuery: String
  });

  const emit = defineEmits(["refresh"]);
  const movies = ref([]);
  const currentPage = ref(1);
  const perPage = 12;
  const editing = ref(null);
  const showModal = ref(false);


  // Fetch movies dari Firebase
  const fetchMovies = async () => {
    try {
      const data = await getMovies(); // harus return array
      movies.value = data || [];      // guard kalau data null/undefined
      console.log(movies.value, "movies loaded");
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      movies.value = [];
    }
  };

  // Jalankan saat component mounted
  onMounted(fetchMovies);

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

  // function closeForm() {
  //   editing.value = null;
  // }

  async function handleSaved(payload) {
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

  const filteredMovies = computed(() => {
    if (!props.searchQuery) return movies.value;
    return movies.value.filter(m =>
      m.title.toLowerCase().includes(props.searchQuery.toLowerCase())
    );
  });

  function openEdit(movie) {
    editing.value = { ...movie };
    console.log(editing.value, 'editing');
    showModal.value = true;
  }

  async function confirmDelete(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await deleteMovie(id);
        Swal.fire("Deleted!", "Movie has been deleted.", "success");
        movies.value = await getMovies(); // reload movies list
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete movie.", "error");
      }
    }
  } 

  function closeModal() {
    showModal.value = false;
    editing.value = null;
  }

  async function handleSave(payload) {
    await updateMovie(payload.id, payload); // ini sudah Realtime Database
    movies.value = await getMovies();       // reload data supaya tampilan update
    closeModal();
  }

  const paginatedMovies = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    const end = start + perPage;
    return filteredMovies.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(filteredMovies.value.length / perPage);
  });

  // Navigasi halaman
  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  }
  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  }
</script>
