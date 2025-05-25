// authservice.js - Authentication Service Component
import { auth } from '../firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';

class AuthService {
  constructor() {
    this.auth = auth;
    this.currentUser = null;
    this.initAuthStateListener();
  }

  /**
   * Initialize authentication state listener
   */
  initAuthStateListener() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      this.dispatchAuthStateChangeEvent();
    });
  }

  /**
   * Dispatch custom event when auth state changes
   */
  dispatchAuthStateChangeEvent() {
    const event = new CustomEvent('authStateChanged', {
      detail: {
        user: this.currentUser,
        isAuthenticated: !!this.currentUser
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * Register a new user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} displayName - User's display name
   * @returns {Promise<UserCredential>}
   */
  async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Update user profile with display name
      await this.updateUserProfile({ displayName });

      // Send email verification
      await this.sendVerificationEmail();

      return userCredential;
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Login with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<UserCredential>}
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logout the current user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   * @param {string} email - User's email
   * @returns {Promise<void>}
   */
  async sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send email verification
   * @returns {Promise<void>}
   */
  async sendVerificationEmail() {
    if (!this.auth.currentUser) {
      throw new Error('No user is currently signed in.');
    }

    try {
      await sendEmailVerification(this.auth.currentUser);
    } catch (error) {
      console.error('Email verification error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.displayName - User's display name
   * @param {string} profileData.photoURL - User's photo URL
   * @returns {Promise<void>}
   */
  async updateUserProfile({ displayName, photoURL }) {
    if (!this.auth.currentUser) {
      throw new Error('No user is currently signed in.');
    }

    try {
      await updateProfile(this.auth.currentUser, {
        displayName,
        photoURL
      });
      this.currentUser = this.auth.currentUser;
      this.dispatchAuthStateChangeEvent();
    } catch (error) {
      console.error('Profile update error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get the current user's ID token
   * @param {boolean} forceRefresh - Whether to force token refresh
   * @returns {Promise<string>} - The ID token
   */
  async getIdToken(forceRefresh = false) {
    if (!this.auth.currentUser) {
      return null;
    }

    try {
      return await this.auth.currentUser.getIdToken(forceRefresh);
    } catch (error) {
      console.error('Get ID token error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Handle Firebase authentication errors
   * @param {Error} error - The error object
   * @returns {Error} - Friendly error message
   */
  handleAuthError(error) {
    let errorMessage = 'An unknown authentication error occurred.';

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many attempts. Account temporarily locked.';
        break;
      case 'auth/requires-recent-login':
        errorMessage = 'Please log in again to perform this action.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled.';
        break;
      default:
        console.error('Unhandled auth error:', error);
    }

    return new Error(errorMessage);
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;