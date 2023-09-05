// Import React for creating React components
import React from "react";

// Import the Pagination and Pokemon components
import Pagination from "./Pagination";
import Pokemon from "./Pokemon";

// Define the Pokedex component
const Pokedex = (props) => {
  // Destructure props for easier access
  const { pokemons, page, setPage, total, loading } = props;

  // Function to navigate to the previous page
  const lastPage = () => {
    const nextPage = Math.max(page - 1, 0);
    setPage(nextPage);
  };

  // Function to navigate to the next page
  const nextPage = () => {
    const nextPage = Math.min(page + 1, total - 1);
    setPage(nextPage);
  };

  return (
    <div>
      <div className="header">
        <h1>Pokedex</h1>
        {/* Render the Pagination component */}
        <Pagination
          page={page + 1}
          totalPages={total}
          onLeftClick={lastPage}
          onRightClick={nextPage}
        />
      </div>
      {/* Conditionally render loading or the list of pokemons */}
      {loading ? (
        <div>Cargando pokemones...</div>
      ) : (
        <div className="pokedex-grid">
          {/* Map through the list of pokemons and render each Pokemon component */}
          {pokemons.map((pokemon, idx) => {
            return <Pokemon pokemon={pokemon} key={pokemon.name} />;
          })}
        </div>
      )}
    </div>
  );
};

// Export the Pokedex component
export default Pokedex;
