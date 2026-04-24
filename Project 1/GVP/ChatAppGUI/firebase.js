const firebaseConfig = {
  apiKey: "AIzaSyCM0I06m42culO5wJScfy604uon9FnHceU",
  authDomain: "chatozz-cdd01.firebaseapp.com",
  databaseURL: "https://chatozz-cdd01-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatozz-cdd01",
  storageBucket: "chatozz-cdd01.firebasestorage.app",
  messagingSenderId: "299268749134",
  appId: "1:299268749134:web:a7067f6d485cb63b8c901f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Make global
window.db = firebase.database();

console.log("Firebase initialized successfully:", window.db);