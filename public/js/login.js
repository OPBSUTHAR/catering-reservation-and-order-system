//import web module api
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";


// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

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

  const loginForm = document.getElementById('loginForm');
  const loginButton = document.getElementById('loginButton');
  const signupForm = document.getElementById('signupForm');
  const signupButton = document.getElementById('signupButton');
  const logoutButton = document.getElementById('logoutButton');

  const email = document.getElementById('email').ariaValueMax;
  const password = document.getElementById('password').ariaValueMax;
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage'); 
    const userMessage = document.getElementById('userMessage');
    const userEmail = document.getElementById('userEmail');
    const userPassword = document.getElementById('userPassword');
    const userName = document.getElementById('userName');
    const userPhone = document.getElementById('userPhone');
    const userAddress = document.getElementById('userAddress');
  const userRole = document.getElementById('userRole'); 
    const userId = document.getElementById('userId');

    const submit = document.getElementById('submit');
  const cancel = document.getElementById('cancel');
  submit.addEventListener('click', (e) => {
    e.preventDefault();

    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    alert("creating account...")
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("Error creating account: " + errorMessage);
    // ..
  });

    // Here you would typically send the user data to your server or Firebase
    console.log('User data submitted:', user);
    successMessage.textContent = 'User data submitted successfully!';
  });
  cancel.addEventListener('click', (e) => {
    e.preventDefault();
    userEmail.value = '';
    userPassword.value = '';
    userName.value = '';
    userPhone.value = '';
    userAddress.value = '';
    userRole.value = '';
    successMessage.textContent = '';
  });