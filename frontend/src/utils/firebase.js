// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ Add this line

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwBZ5Jhqdah7on28Eoo7D5TsiZta7jgN0",
  authDomain: "login-5a38e.firebaseapp.com",
  projectId: "login-5a38e",
  storageBucket: "login-5a38e.appspot.com", // ✅ fixed incorrect domain
  messagingSenderId: "791580515082",
  appId: "1:791580515082:web:377ef57eb552847701b8f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); // ✅ Complete the initialization

export { auth, provider };
