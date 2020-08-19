import React, { useState, useRef, useEffect } from "react";
import "./App.css";

// simule l'appel au backend en renvoyant une réponse au bout d'un certain délai
const simulateBackendApi = searchFor => {
  return new Promise(resolve => {
    // on simule un certain temps avant de répondre
    const delay = 1000 + Math.random() * 4000;
    setTimeout(() => {
      // réponse test
      const response = { data: [{ name: "test" }, { name: "dernier" }] };
      resolve(response);
    }, delay);
  });
};

function App() {
  const [searching, setSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const refSearchText = useRef(searchText);
  const debouncedSearchText = useDebounce(searchText, 500);

  useEffect(() => {
    if (debouncedSearchText) {
      // temp: vide les résultats pour bien voir le retour
      setResults([]);

      setSearching(true);
      // on stocke la dernière recherche
      refSearchText.current = debouncedSearchText;

      console.log("appel du backend avec", debouncedSearchText);
      simulateBackendApi(debouncedSearchText).then(response => {
        console.log("réponse du back (pour / attendu)", debouncedSearchText, refSearchText.current);
        // est ce que cette réponse correspond à la dernière recherche ?
        if (debouncedSearchText === refSearchText.current) {
          console.log("render avec", debouncedSearchText);
          setResults(response.data);
        } else {
          console.log("réponse ignorée car obsolète");
        }
        setSearching(false);
      });
    } else {
      setResults([]);
    }
  }, [debouncedSearchText]);

  return (
    <div className="App">
      <div>Exemple de recherche avec économie d'appels et de rendus</div>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchText}
        onChange={event => setSearchText(event.target.value)}
      />
      {searching && <div>Searching...</div>}
      <div>Résultats</div>
      {results.map((item, index) => {
        return <div key={index}>{item.name}</div>;
      })}
    </div>
  );
}

export default App;

// mon debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handlerTimeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handlerTimeout);
    };
  }, [value]);

  return debouncedValue;
};
