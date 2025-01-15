import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBPvlKjiFb0E1hFtsMBjugqzu83V_spaEc",
  authDomain: "gerenciador-volei.firebaseapp.com",
  databaseURL: "https://gerenciador-volei-default-rtdb.firebaseio.com",
  projectId: "gerenciador-volei",
  storageBucket: "gerenciador-volei.appspot.com",
  messagingSenderId: "396631646457",
  appId: "1:396631646457:web:95d3cbf5a3e10b5884c228",
  measurementId: "G-JJP6ZQ05H2"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o banco de dados e a autenticação
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
