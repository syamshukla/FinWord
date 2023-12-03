// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { useState } from 'react'
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


const getUsersCount = async () => {
  try {
    // Reference to the "users" collection
    const usersCollection = collection(db, 'users');

    // Get all documents in the "users" collection
    const usersSnapshot = await getDocs(usersCollection);

    // Count the number of documents (users)
    const numberOfUsers = usersSnapshot.size;

    console.log('Number of users:', numberOfUsers);
    return numberOfUsers;
  } catch (error) {
    console.error('Error fetching users count:', error);
    throw error;
  }
};

// get all users
const getUsers = async () => {
  try {
    // Reference to the "users" collection
    const usersCollection = collection(db, 'users');

    // Get all documents in the "users" collection
    const usersSnapshot = await getDocs(usersCollection);
    return usersSnapshot;
  } catch (error) {
    console.error('Error fetching users count:', error);
    throw error;
  }
}
const getPicks = async () => {
  try {
    // Reference to the "users" collection
    const usersCollection = collection(db, 'picks');

    // Get all documents in the "users" collection
    const usersSnapshot = await getDocs(usersCollection);
    return usersSnapshot;
  } catch (error) {
    console.error('Error fetching users count:', error);
    throw error;
  }
}

export { app, fireStore, analytics, auth, googleProvider, firebaseConfig, db, getUsersCount, getUsers, getPicks}
