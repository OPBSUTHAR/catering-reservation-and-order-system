import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

// Notification function
function showNotification(message, type = 'info', elementId = 'notification') {
  const notification = document.getElementById(elementId);
  if (notification) {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => notification.classList.remove('show'), 3000);
  }
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (!user.emailVerified) {
        showNotification('Please verify your email before logging in. Check your inbox or spam folder.', 'error');
        await auth.signOut();
        return;
      }

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        showNotification('User data not found. Please register again.', 'error');
        await auth.signOut();
        return;
      }

      const userRole = userDoc.data().role;
      if (userRole !== role) {
        showNotification(`Please select the correct role: ${userRole}.`, 'error');
        return;
      }

      showNotification('Successfully signed in!', 'success');
      setTimeout(() => {
        window.location.href = userRole === 'admin' ? 'admin-dashboard.html' : 'customer-dashboard.html';
      }, 1500);
    } catch (error) {
      let message = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.';
      }
      showNotification(message, 'error');
      console.error('Login error:', error);
    }
  });

  // Google Sign-In Handler (assumes customer role)
  const googleSignIn = document.getElementById('googleSignIn');
  if (googleSignIn) {
    googleSignIn.addEventListener('click', async (e) => {
      e.preventDefault();
      const provider = new GoogleAuthProvider();
      try {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        // Check if user exists in Firestore, create if not
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            name: user.displayName || 'Google User',
            email: user.email,
            phone: '',
            role: 'customer',
            createdAt: new Date().toISOString()
          });
        }

        const userRole = (await getDoc(userDocRef)).data().role;
        showNotification(`Welcome, ${user.displayName || 'User'}!`, 'success');
        setTimeout(() => {
          window.location.href = userRole === 'admin' ? 'admin-dashboard.html' : 'customer-dashboard.html';
        }, 1500);
      } catch (error) {
        showNotification(`Google sign-in failed: ${error.message}`, 'error');
        console.error('Google sign-in error:', error);
      }
    });
  }

  // Password toggle
  document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', () => {
      const input = document.getElementById(icon.dataset.target);
      input.type = input.type === 'password' ? 'text' : 'password';
      icon.classList.toggle('fa-eye-slash');
    });
  });
}

// Register Form Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset error messages
    document.querySelectorAll('small').forEach(el => el.style.display = 'none');

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;
    const terms = document.getElementById('terms').checked;

    // Client-side validation
    if (!name) return showError('nameError');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return showError('emailError');
    if (!/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(phone)) return showError('phoneError');
    if (password.length < 6) return showError('passwordError');
    if (password !== confirmPassword) return showError('confirmPasswordError');
    if (!terms) return showError('termsError');

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created in Firebase Authentication:', user.uid);

      // Update user profile with displayName
      await user.updateProfile({ displayName: name });
      console.log('User profile updated with displayName:', name);

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        phone: phone,
        role: role,
        createdAt: new Date().toISOString()
      });
      console.log('User data stored in Firestore:', { name, email, phone, role });

      // Send email verification
      await user.sendEmailVerification();
      console.log('Email verification sent to:', email);

      showNotification('Account created! Please verify your email and log in.', 'success');
      setTimeout(() => window.location.href = 'login.html', 3000);
    } catch (error) {
      let message = 'Registration failed.';
      if (error.code === 'auth/email-already-in-use') message = 'Email already in use.';
      if (error.code === 'auth/invalid-email') message = 'Invalid email format.';
      if (error.code === 'firestore/permission-denied') message = 'Database access denied. Please check Firebase rules.';
      showNotification(message, 'error');
      console.error('Registration error:', error);
    }
  });

  // Password toggle
  document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', () => {
      const input = document.getElementById(icon.dataset.target);
      input.type = input.type === 'password' ? 'text' : 'password';
      icon.classList.toggle('fa-eye-slash');
    });
  });

  // Error display function
  function showError(id) {
    const el = document.getElementById(id);
    el.style.display = 'block';
    el.parentElement.classList.add('shake');
    setTimeout(() => el.parentElement.classList.remove('shake'), 300);
  }
}