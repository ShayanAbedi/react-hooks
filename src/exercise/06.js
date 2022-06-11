// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [globalState, setGlobalState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (pokemonName) {
      setGlobalState({status: 'pending'})
      fetchPokemon(pokemonName)
        .then(pokemonData => {
          setGlobalState({status: 'resolved', pokemon: {pokemonData}})
        })
        .catch(err => {
          setGlobalState({status: 'rejected', error: err})
        })
    }
  }, [pokemonName])

  switch (globalState.status) {
    case 'idle':
      return 'Submit a pokeamon'
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      return (
        <div role="alert">
          There was an error:
          <pre style={{whiteSpace: 'normal'}}>{globalState.error.message}</pre>
        </div>
      )
    case 'resolved':
      return <PokemonDataView pokemon={globalState.pokemon} />
    default:
      break
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <PokemonErrorBoundary key={pokemonName}>
        <div className="pokemon-info">
          <PokemonInfo pokemonName={pokemonName} />
        </div>
      </PokemonErrorBoundary>
    </div>
  )
}

export default App
