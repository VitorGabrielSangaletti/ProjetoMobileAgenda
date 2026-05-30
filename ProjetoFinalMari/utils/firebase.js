import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBOBdQmRzjNiCoYvNbQb5YIvSp1UsgRMMw",
  authDomain: "projetoagenda2026.firebaseapp.com",
  projectId: "projetoagenda2026",
  storageBucket: "projetoagenda2026.firebasestorage.app",
  messagingSenderId: "454922523844",
  appId: "1:454922523844:web:75d30fc5ccc80c533fa591"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
