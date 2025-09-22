import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA3aDzhhLsU3TXfIawmLwp9bd7AmpTv6MI",
  authDomain: "movie-app-e93d9.firebaseapp.com",
  databaseURL: "https://movie-app-e93d9-default-rtdb.asia-southeast1.firebasedatabase.app", // wajib
  projectId: "movie-app-e93d9",
  storageBucket: "movie-app-e93d9.appspot.com",
  messagingSenderId: "462559443974",
  appId: "1:462559443974:web:7384cb31c64962145dd787"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
