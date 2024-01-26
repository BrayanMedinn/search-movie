import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css'
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it';

const useSearch = () => {
  const [query, setQuery] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if(isFirstInput.current) {
      isFirstInput.current = query === ''
      return
    }
    if(query === ''){
      setError('No se puede buscar una pelicula vacia')
      return
    }
    if(query.length < 3){
      setError('La busqueda debe tener minimo 3 caracteres')
      return 
    }

    setError(null)
  },[query])

  return {query, setQuery, error}
}

function App() {
  const [sort, setSort] = useState(false)
  const {query, setQuery, error} = useSearch()
  const {movies,loading, getMovies} = useMovies({ query, sort })

  const deboncedGetMovies = useCallback(
    debounce(query => {
      console.log('debounce' , query)
      getMovies({query})
    }, 300)
    , [])

  const handleSort = () => {
    setSort(!sort)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ query })
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    setQuery(newSearch)
    deboncedGetMovies(newSearch)
  }

  return (
    <div className='page'>
      <header>
        <h1>Busca tu peli</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input onChange={handleChange} value={query} name="query" type="text" placeholder='Harry Potter, Star Wars, The matrix...' />
          <input type="checkbox" onChange={handleSort}  checked={sort} />
          <button type='submit'>Buscar</button>
        </form>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </header>

      <main>
        {loading ? <p>Cargando....</p> :  <Movies movies={movies}/>}
      </main>
    </div>
  )
}

export default App
