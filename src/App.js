import { useCallback, useEffect, useState } from "react";
import './App.css';
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const resp = await fetch('https://swapi.dev/api//films/');
      const resp = await fetch(process.env.REACT_APP_MOVIES_LINK);
      if(!resp.ok) {
        throw new Error('Something went wrong');
      }

      const data = await resp.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      // const transformMovies = data.results.map(movie => {
      //   return {
      //     id: movie.episode_id,
      //     title: movie.title,
      //     openingText: movie.opening_crawl,
      //     releaseDate: movie.release_date,
      //   };
      // });
      // setMovies(transformMovies);
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  let content = <p>Found no movies.</p> ;
  
  if(movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }else if(error) {
    content = <p>{error}</p>;
  }else if(isLoading) {
    content = <p>Loading...</p>;
  }

  const addMovieHandler = async (movie) => {
    // setMovies([...movies, movie]);
    const res = await fetch(process.env.REACT_APP_MOVIES_LINK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movie),
    });
    const newData = await res.json();
    console.log(newData);
  };

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section> {content} </section>
    </>
  );
}

export default App;
