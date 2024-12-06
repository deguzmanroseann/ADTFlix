import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [movieId, setMovieId] = useState('');
  const [credits, setCredits] = useState([]);
  const [castAndCrew, setCastAndCrew] = useState([]);

  const fetchCredits = async () => {
    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      headers: {
        Accept: 'application/json',
        Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OGNiZTJmYWIzZjQ4ZDEzMzEzNDRlM2QwMTNhNjhkNCIsIm5iZiI6MTczMzM4MTE1Ny45LCJzdWIiOiI2NzUxNGMyNTUxNmVkZWFiMjk5OTI0YjIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.uA1i_MVjKY65bwsonISpiGFT2CW_mhZCSUrWWw2JhEc',
      },
    }).then((response) => {
      setCastAndCrew(response.data.cast);
      console.log(response.data.results);
    });
    }

  const addMemberToDatabase = async (member) => {
    try {
      await axios.post('http://localhost:3001/api/cast_and_crew', {
        name: member.name,
        role: member.known_for_department,
        role_description: 'Unknown', 
        email: '',
        phone: '',
        experience: 'Unknown',
        salary: 0,
      });
      setCastAndCrew((prev) => [...prev, member]); 
    } catch (error) {
      console.error('Error adding member to database', error);
    }
  };

  return (
    <div>
      <h1>Movie Cast and Crew</h1>
      <input
        type="text"
        placeholder="Enter Movie ID"
        value={movieId}
        onChange={(e) => setMovieId(e.target.value)}
      />
      <button onClick={fetchCredits}>Search Credits</button>

      <div>
        <h2>Cast and Crew</h2>
        <ul>
          {credits.map((member) => (
            <li key={member.id}>
              {member.name} ({member.known_for_department})
              <button onClick={() => addMemberToDatabase(member)}>Add</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Added Cast and Crew Members</h2>
        <ul>
          {castAndCrew.map((member) => (
            <li key={member.id}>
              {member.name} ({member.role})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;