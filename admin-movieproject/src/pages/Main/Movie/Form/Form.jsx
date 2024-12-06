import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import './Form.css';

const Form = () => {
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  const navigate = useNavigate();
  let { movieId } = useParams();

  const handleSearch = useCallback(() => {
    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
      headers: {
        Accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OGNiZTJmYWIzZjQ4ZDEzMzEzNDRlM2QwMTNhNjhkNCIsIm5iZiI6MTczMzM4MTE1Ny45LCJzdWIiOiI2NzUxNGMyNTUxNmVkZWFiMjk5OTI0YjIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.uA1i_MVjKY65bwsonISpiGFT2CW_mhZCSUrWWw2JhEc',
      },
    }).then((response) => {
      setSearchedMovieList(response.data.results);
      console.log(response.data.results);
    });
  }, [query]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
  };

  const handleSave = () => {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
    if (selectedMovie === undefined) {
      //add validation
      alert('Please search and select a movie.');
    } else {
      const data = {
        tmdbId: selectedMovie.id,
        title: selectedMovie.title,
        overview: selectedMovie.overview,
        popularity: selectedMovie.popularity,
        releaseDate: selectedMovie.release_date,
        voteAverage: selectedMovie.vote_average,
        backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
        posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
        isFeatured: 0,
      };

      const request = axios({
        method: 'post',
        url: '/movies',
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((saveResponse) => {
          console.log(saveResponse);
          alert('Success');
        })
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    if (movieId) {
      axios.get(`/movies/${movieId}`).then((response) => {
        setMovie(response.data);
        const tempData = {
          id: response.data.tmdbId,
          original_title: response.data.title,
          overview: response.data.overview,
          popularity: response.data.popularity,
          poster_path: response.data.posterPath,
          release_date: response.data.releaseDate,
          vote_average: response.data.voteAverage,
        };
        setSelectedMovie(tempData);
        console.log(response.data);
      });
    }
  }, [movieId]);

  return (
    <>
      <h1>{movieId !== undefined ? 'Edit ' : 'Create '} Movie</h1>

      {movieId === undefined && (
        <>
          <div className='search-container'>
            Search Movie:{' '}
            <input
              type='text'
              id="movie-query"
              name="movie-query"
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type='button' onClick={handleSearch}>
              Search
            </button>
            <div className='searched-movie'>
              {searchedMovieList.map((movie) => (
                <p onClick={() => handleSelectMovie(movie)} key={movie.id}>
                  {movie.original_title}
                </p>
              ))}
            </div>
          </div>
          <hr />
        </>
      )}

      <div className='container'>
        <form>
          {selectedMovie ? (
            <img
              className='poster-image'
              src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
              alt={selectedMovie.original_title}
            />
          ) : (
            ''
          )}
          <div className='field'>
            Title:
            <input
              type='text'
              id="movie-title"
              name="movie-title"
              value={selectedMovie ? selectedMovie.original_title : ''}
              onChange={(e) => {
                setSelectedMovie((prev) => ({
                  ...prev,
                  original_title: e.target.value,
                }));
              }}
            />
          </div>
          <div className='field'>
            Overview:
            <textarea
              rows={10}
              id="movie-overview"
              name="movie-overview"
              value={selectedMovie ? selectedMovie.overview : ''}
              onChange={(e) => {
                setSelectedMovie((prev) => ({
                  ...prev,
                  overview: e.target.value,
                }));
              }}
            />
          </div>

          <div className='field'>
            Popularity:
            <input
              type='text'
              id="movie-popularity"
              name="movie-popularity"
              value={selectedMovie ? selectedMovie.popularity : ''}
              onChange={(e) => {
                setSelectedMovie((prev) => ({
                  ...prev,
                  popularity: e.target.value,
                }));
              }}
            />
          </div>

          <div className='field'>
            Release Date:
            <input
              type='text'
              id="movie-release-date"
              name="movie-release-date"
              value={selectedMovie ? selectedMovie.release_date : ''}
              onChange={(e) => {
                setSelectedMovie((prev) => ({
                  ...prev,
                  release_date: e.target.value,
                }));
              }}
            />
          </div>

          <div className='field'>
            Vote Average:
            <input
              type='text'
              id="movie-vote-average"
              name="movie-vote-average"
              value={selectedMovie ? selectedMovie.vote_average : ''}
              onChange={(e) => {
                setSelectedMovie((prev) => ({
                  ...prev,
                  vote_average: e.target.value,
                }));
              }}
            />
          </div>

          <button type='button' onClick={handleSave}>
            Save
          </button>
        </form>
      </div>

      {movieId !== undefined && selectedMovie && (
        <div>
          <hr />
          <nav>
            <ul className='tabs'>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/cast-and-crews`);
                }}
              >
                Cast & Crews
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/videos`);
                }}
              >
                Videos
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/photos`);
                }}
              >
                Photos
              </li>
            </ul>
          </nav>

          <Outlet />
        </div>
      )}
    </>
  );
};

export default Form;