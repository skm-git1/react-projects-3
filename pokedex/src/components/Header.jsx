
export const Header = (props) => {
  const {handleToggleMenu} = props;

  return (
    <header>
      <button onClick={handleToggleMenu} className="open-nav-button">
        <i class="fa-solid fa-bars"></i>
      </button>
      <h1 className="text-gradient">Pokèdex</h1>
    </header>
  )
}

