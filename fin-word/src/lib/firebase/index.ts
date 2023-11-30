// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBsmk11nprS0cxhK_Sm6MrBkoNrooE4dNU',
  authDomain: 'finword-6cfbb.firebaseapp.com',
  projectId: 'finword-6cfbb',
  storageBucket: 'finword-6cfbb.appspot.com',
  messagingSenderId: '630700130339',
  appId: '1:630700130339:web:16943bc524200c344cf196',
  measurementId: 'G-2CNPXRWEZN',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const fireStore = getFirestore(app)
const analytics = getAnalytics(app)
const googleProvider = new GoogleAuthProvider()
const auth = getAuth()
const db = getFirestore(app)
export { app, fireStore, analytics, auth, googleProvider, firebaseConfig, db }
