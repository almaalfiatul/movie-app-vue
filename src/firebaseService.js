// firebaseService.js
import { database } from "./firebase";
import { ref as dbRef, get, set, push, update, remove } from "firebase/database";
import Swal from "sweetalert2";

// Ambil semua movies
export async function getMovies() {
  const snapshot = await get(dbRef(database, "movies"));
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.entries(data).map(([id, movie]) => ({
      id,
      ...movie,
    }));
  }
  return [];
}

// Tambah movie baru
export async function createMovie(movie) {
  const newRef = push(dbRef(database, "movies"));
  movie.id = newRef.key;
  await set(newRef, movie);
}

export async function updateMovie(id, data) {
  try {
    const movieRef = dbRef(database, `movies/${id}`);
    await update(movieRef, data);
    Swal.fire("Sukses!", "Movie berhasil diperbarui.", "success");
    return true;
  } catch (err) {
    console.error("Failed to update movie:", err);
    Swal.fire("Error!", "Gagal menyimpan movie.", "error");
    throw err;
  }
}

// Hapus movie
export async function deleteMovie(id) {
  await remove(dbRef(database, `movies/${id}`));
}