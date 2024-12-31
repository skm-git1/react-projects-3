import { useState } from "react"
import { first151Pokemon, getFullPokedexNumber } from "../utils"

const SideNav = (props) => {
  const {selectedPokemon, setSelectedPokemon, showSideMenu, handleCloseMenu} = props

  const [searchValue, setSearchValue] = useState('');

  const filteredPokemon = first151Pokemon.filter((ele, eleIdx)=>{
    // if full pokedex value indicates the current search value return true
    if(getFullPokedexNumber(eleIdx).includes(searchValue)) {return true;}

    // if the pokemon name includes the current search value then return true
    else if(ele.toLowerCase().includes(searchValue.toLowerCase())) {return true;}

    // otherwise, exclude value from the array
    else return false;
  })

  return (
    <nav className={'' + (!showSideMenu ? 'open': '')}>
      <div className={"header" + (!showSideMenu ? 'open': '')}>
        <button onClick={handleCloseMenu} className="open-nav-button">
          <i class="fa-solid fa-arrow-left-long"></i>
        </button>
        <h1 className="text-gradient">Pokèdex</h1>
      </div>
      <input placeholder="eg 001 or pika..." value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}}/>
      {
        filteredPokemon.map((pokemon, pokemonIdx)=>{
          // console.log(pokemon);
          const truePokedexNumber = first151Pokemon.indexOf(pokemon);
          return(
            <button onClick={()=>{
              setSelectedPokemon(truePokedexNumber)
              handleCloseMenu()
            }}
              key={pokemonIdx} className={'nav-card'+(pokemonIdx === selectedPokemon ? ' nav-card-selected': '')}>
              <p>{getFullPokedexNumber(truePokedexNumber)}</p>
              <p>{pokemon}</p>
            </button>
          )
        })
      }
    </nav>
  )
}

export default SideNav
