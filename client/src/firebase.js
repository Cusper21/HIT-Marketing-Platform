
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmLDd2ra-owlq33LKIb7VIPi5rE2NM1uk",
  authDomain: "hit-marketing-platform.firebaseapp.com",
  projectId: "hit-marketing-platform",
  storageBucket: "hit-marketing-platform.appspot.com",
  messagingSenderId: "473866806801",
  appId: "1:473866806801:web:83dceaa76c7743d978f3b0"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);