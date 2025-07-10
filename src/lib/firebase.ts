import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAl9yqWgZsb_IPp24AEgKR8IsLZOfvjibI",
  authDomain: "alendar-ar.firebaseapp.com",
  projectId: "alendar-ar",
  storageBucket: "alendar-ar.firebasestorage.app",
  messagingSenderId: "860205315435",
  appId: "1:860205315435:web:f7ac9641de7fc658f5882e",
  measurementId: "G-F60K768DKL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;