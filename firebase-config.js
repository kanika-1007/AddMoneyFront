// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBO7vHvxfsRImHYoyrADhCENoLnbMbNNO0",
  authDomain: "sanwariya-9e5b1.firebaseapp.com",
  projectId: "sanwariya-9e5b1",
  storageBucket: "sanwariya-9e5b1.firebasestorage.app",
  messagingSenderId: "1054330094963",
  appId: "1:1054330094963:web:e12fd26f4d9d3d32bb7106",
  measurementId: "G-KVDVTBNPX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
