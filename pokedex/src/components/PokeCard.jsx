import { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./TypeCard.jsx";
import Modal from "./Modal.jsx";

const PokeCard = (props) => {
  const { selectedPokemon } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);

  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) return false;
    if (["versions", "other"].includes(val)) return false;
    return true;
  });

  async function fetchMoveData(move, moveUrl) {
    if(loadingSkill || !localStorage || !moveUrl) return;

    // check cache for move
    let c = {}
    if(localStorage.getItem('pokemon-moves')){
      c = JSON.parse(localStorage.getItem('pokemon-moves'))
    }

    if(move in c){
      setSkill(c[move]);
      console.log('Found move in cache')
      return;
    }

    try {
      setLoadingSkill(true);
      const res = await fetch(moveUrl);
      const moveData = await res.json();
      console.log('Fetched move from API ' + moveData); 
      
      const description = moveData?.flavor_text_entries.filter(val =>{
        return val.version_group.name == 'firered-leafgreen'
      })[0]?.flavor_text;

      const skillData = {
        name: move,
        description
      }

      setSkill(skillData);
      c[move] = skillData
      localStorage.setItem('pokemon-moves', JSON.stringify(c));
    } catch (error) {
      console.log(error.message);
    } finally{
      setLoadingSkill(false);
    }
  }

  useEffect(() => {
    // if loading, exit loop
    if (loading || !localStorage) return;

    // check if the selected pokemon information is available in the cache
    // 1. define the cache
    let cache = {};
    if (localStorage.getItem("pokedex")) {
      cache = JSON.parse(localStorage.getItem("pokedex"));
    }
    // 2. check if the selected pokemon is in the cache, otherwise fetch from the API
    if (selectedPokemon in cache) {
      // read from cache
      setData(cache[selectedPokemon]);
      console.log('Found pokemon in cache')
      return;
    }

    // we parsed the cache to no avail, now we need to fetch the data from the api
    async function fetchPokemonData(params) {
      setLoading(true);
      try {
        const baseUrl = "https://pokeapi.co/api/v2/";
        const suffix = "pokemon/" + getPokedexNumber(selectedPokemon);
        const finalUrl = baseUrl + suffix;
        const res = await fetch(finalUrl);
        const pokemonData = await res.json();
        setData(pokemonData);
        console.log('Fetched pokemon data')
        console.log(pokemonData);

        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemonData();
    // If we fetch from the API make sure to save the information to the cache for the next time
  }, [selectedPokemon]);

  if (loading || !data) {
    return <h3>Loading...</h3>
  }

  return (
    <div className="poke-card">
      {skill && (
        <Modal handleCloseModal = {()=>{setSkill(null)}}>
          <div>
            <h6>Name</h6>
            <h2 className="skill-name">{skill.name}</h2>
          </div>
          <div>
            <h6>Description</h6>
            <p>{skill.description}</p>
          </div>
        </Modal>
    ) }
      <div className="header">
        <h2>{"#" + getFullPokedexNumber(selectedPokemon)}</h2>
        <h2>{name.toUpperCase()}</h2>
      </div>
      <div className="type-container">
        {types.map((typeObj, typeIdx) => {
          return <TypeCard key={typeIdx} type={typeObj?.type?.name} />;
        })}
      </div>
      <img
        className="default-img"
        src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"}
        alt={`${name}-large-img`}
      />
      <div className="img-container">
        {imgList.map((spriteUrl, spriteIdx) => {
          const imgUrl = sprites[spriteUrl];
          return (
            <img
              key={spriteIdx}
              src={imgUrl}
              alt={`${name}-img-${spriteUrl}`}
            />
          );
        })}
      </div>
      <h3>Stats</h3>
      <div className="stats-card">
        {stats.map((statObj, statIdx) => {
          const { stat, base_stat } = statObj;
          return (
            <div key={statIdx} className="stat-item">
              <p>{stat?.name.replaceAll("-", " ")}</p>
              <h4>{base_stat}</h4>
            </div>
          );
        })}
      </div>
      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {moves.map((moveObj, moveIdx) => {
          return (
            <button
              key={moveIdx}
              className="button-card pokemon-move"
              onClick={() => {fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)}}
            >
              <p>{moveObj?.move?.name.replaceAll("-", " ")}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PokeCard;