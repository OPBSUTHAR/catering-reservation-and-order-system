import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTMagK8zneRb7DjWbFO9CgV03z7Khmy3g",
  authDomain: "cateringreservationorderingsys.firebaseapp.com",
  projectId: "cateringreservationorderingsys",
  storageBucket: "cateringreservationorderingsys.firebasestorage.app",
  messagingSenderId: "737129861298",
  appId: "1:737129861298:web:9f35ebc42b566b475039ab",
  measurementId: "G-F7FYE2NDF3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the services
export { auth, db, storage, analytics };