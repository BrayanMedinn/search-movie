import { useRef, useState, useMemo } from 'react';
import { searchMovies } from '../services/movies';


export function useMovies ({query, sort}) {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const previousSearch = useRef(query)
    
    const getMovies = useMemo(() => {
        return async ({ query }) => {
            if(query === previousSearch.current) return 
            try {
                setLoading(true)
                setError(null)
                previousSearch.current = query
                const newMovies = await searchMovies({ query })
                setMovies(newMovies)
            } catch (e) {
                setError(e.message)
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }
    }, [])
    
    const sortedMovies = useMemo(() => {
        console.log('sortedMovies')
       return sort 
    ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
    : movies
    }, [sort, movies])


    return { movies: sortedMovies, getMovies, loading, error }
  }