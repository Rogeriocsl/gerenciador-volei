import React, { useEffect, useState } from "react";
import { database } from "../firebase"; // Certifique-se de que o caminho está correto
import { ref, set, onValue } from "firebase/database";

function Home() {
  const [data, setData] = useState(null);

  // Escreve dados no Firebase
  const writeData = () => {
    const dbRef = ref(database, "test/");
    set(dbRef, {
      message: "Olá, Realtime Database!",
      timestamp: Date.now(),
    })
      .then(() => console.log("Dados escritos com sucesso!"))
      .catch((error) => console.error("Erro ao escrever dados:", error));
  };

  // Lê dados do Firebase
  useEffect(() => {
    const dbRef = ref(database, "test/");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      setData(data);
    });
  }, []);

  return (
    <div>
      <h1>Teste do Firebase Realtime Database</h1>
      <button onClick={writeData}>Escrever Dados</button>
      <pre>{data ? JSON.stringify(data, null, 2) : "Carregando dados..."}</pre>
    </div>
  );
}

export default Home;
