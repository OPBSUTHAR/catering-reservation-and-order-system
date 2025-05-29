Catering Reservation and Ordering System
A web application designed for catering businesses to efficiently manage reservations, orders, and menu items, with role-based dashboards for admins and customers.
Purpose
The Catering Reservation and Ordering System allows catering businesses to streamline their operations by providing tools to manage customer orders, reservations, and menu items. Customers can place orders and book reservations, while admins can oversee all activities, update menu items, and track business performance through a dashboard.
Features

User Authentication: Secure login, registration, and password reset using Firebase Authentication.
Order Management: Customers can place orders; both customers and admins can edit, delete, or mark orders as done, with real-time updates to Firebase Firestore.
Reservation Management: Book, edit, delete, or mark reservations as done, with role-based access control.
Menu Management: Admins can add, edit, or delete menu items.
Role-Based Dashboards:
Customer Dashboard: View and manage personal orders and reservations.
Admin Dashboard: Manage all orders, reservations, menu items, and view business stats (e.g., total orders, revenue trends).


Real-Time Updates: All actions (edit, delete, done) reflect instantly in the Firebase Firestore database.
Responsive Design: Optimized for both mobile and desktop devices with a light/dark theme toggle.

Technologies

Frontend: HTML5, CSS3, JavaScript (vanilla)
Libraries:
Font Awesome (for icons)
Chart.js (for revenue trend charts in the dashboard)


Backend: Firebase
Firebase Authentication (user management)
Firebase Firestore (real-time database)


Styling: Custom CSS with CSS variables for theming, responsive design with media queries
Database: Firebase Firestore

Setup
Follow these steps to set up the project locally:

Clone the Repository:
git clone https://github.com/your-username/catering-reservation-ordering-system.git
cd catering-reservation-ordering-system


Set Up Firebase:

Create a Firebase project at Firebase Console.
Enable Authentication (Email/Password provider).
Enable Firestore Database and create a database in production mode.
Update the Firebase configuration in dashboard.html (and other files like login.html, register.html) with your project’s config:const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};


Set up Firestore security rules (see below).


Firestore Security Rules:

In the Firebase Console, go to Firestore > Rules and apply the following rules:rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /orders/{orderId} {
      allow create: if request.auth != null && request.resource.data.customerId == request.auth.uid;
      allow read, update, delete: if request.auth != null && resource.data.customerId == request.auth.uid;
      allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    match /reservations/{reservationId} {
      allow create: if request.auth != null && request.resource.data.customerId == request.auth.uid;
      allow read, update, delete: if request.auth != null && resource.data.customerId == request.auth.uid;
      allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    match /menu/{menuId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}




Serve the Project:

Install a local server (e.g., using npx):npx serve


Alternatively, if you have Node.js installed, you can use:npm install -g serve
serve




Access the Application:

Open your browser and navigate to http://localhost:3000 (or the port provided by your server).
Register a new user or log in with an existing account.



Usage

Register/Login:

Navigate to register.html to create a new account (select role: customer or admin).
Use login.html to sign in with your email and password.


Customer Dashboard:

View and manage your orders and reservations.
Place new orders or book reservations using the respective tabs.
Edit, delete, or mark orders/reservations as done.


Admin Dashboard:

Access all orders, reservations, and menu items.
Add, edit, or delete menu items in the “Menu” tab.
Use the “Action” buttons (Edit, Delete, Done) to manage entries.
View stats like total orders and revenue trends.



Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit (git commit -m "Add your feature").
Push to your branch (git push origin feature/your-feature).
Open a Pull Request.

Please ensure your code follows the project’s style and includes appropriate comments.
License
This project is licensed under the MIT License. See the LICENSE file for details.
