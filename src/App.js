
import React from "react";
import "./index.css";
// Importa diversos componentes y funciones
import Navbar from "./components/Navbar";
import Searchbar from "./components/Searchbar";
import Pokedex from "./components/Pokedex";
import { getPokemonData, getPokemons, searchPokemon } from "./api";
import { FavoriteProvider } from "./contexts/favoritesContext";
import Footer from "./components/Footer";

// Destructura useState y useEffect
const { useState, useEffect } = React;

// Clave para el almacenamiento local para guardar los pokémones favoritos
const localStorageKey = "favorite_pokemon";


export default function App() {
  // Estado para administrar los pokémones, la paginación, la carga, los favoritos, notFound y searching
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);

  // Función para obtener los pokémones desde la API
  const fetchPokemons = async () => {
    try {
      setLoading(true);
      const data = await getPokemons(25, 25 * page);
      const promises = data.results.map(async (pokemon) => {
        return await getPokemonData(pokemon.url);
      });
      const results = await Promise.all(promises);
      setPokemons(results);
      setLoading(false);
      setTotal(Math.ceil(data.count / 25));
      setNotFound(false);
    } catch (err) {}
  };

  // Función para cargar los pokémones favoritos desde el almacenamiento local
  const loadFavoritePokemons = () => {
    const pokemons =
      JSON.parse(window.localStorage.getItem(localStorageKey)) || [];
    setFavorites(pokemons);
  };

  // Efecto que carga los pokémones favoritos al cargar la página
  useEffect(() => {
    loadFavoritePokemons();
  }, []);

  // Efecto que realiza una nueva llamada a la API al cambiar la página
  useEffect(() => {
    if (!searching) {
      fetchPokemons();
    }
  }, [page]);

  // Función para actualizar los pokémones favoritos
  const updateFavoritePokemons = (name) => {
    const updated = [...favorites];
    const isFavorite = updated.indexOf(name);
    if (isFavorite >= 0) {
      updated.splice(isFavorite, 1);
    } else {
      updated.push(name);
    }
    setFavorites(updated);
    window.localStorage.setItem(localStorageKey, JSON.stringify(updated));
  };

  // Función para buscar pokémones por nombre
  const onSearch = async (pokemon) => {
    if (!pokemon) {
      return fetchPokemons();
    }
    setLoading(true);
    setNotFound(false);
    setSearching(true);
    const result = await searchPokemon(pokemon);
    if (!result) {
      setNotFound(true);
      setLoading(false);
      return;
    } else {
      setPokemons([result]);
      setPage(0);
      setTotal(1);
    }
    setLoading(false);
    setSearching(false);
  };

  return (
    <FavoriteProvider
      value={{
        favoritePokemons: favorites,
        updateFavoritePokemons: updateFavoritePokemons
      }}
    >
      <div>
        <Navbar />
        <div className="App">
          <Searchbar onSearch={onSearch} />
          {notFound ? (
            <div className="not-found-text">
              No se encontró el Pokémon que buscabas 😭
            </div>
          ) : (
            <Pokedex
              loading={loading}
              pokemons={pokemons}
              page={page}
              setPage={setPage}
              total={total}
            />
          )}
        </div>
        <Footer />
      </div>
    </FavoriteProvider>
  );
};
