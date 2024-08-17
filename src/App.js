import React, { useEffect, useState } from 'react';
import { db } from '../src/firebase'; // Adjust this path if necessary
import { collection, getDocs } from 'firebase/firestore';
import './App.css';
import logo from './logo.jpg'; // Import your logo image

const App = () => {
  const [posts, setPosts] = useState([]);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7; // Number of posts per page

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, 'posts'); // Reference to the 'posts' collection
      const postsSnapshot = await getDocs(postsCollection); // Fetch the documents
      const postsData = postsSnapshot.docs.map(doc => ({
        id: doc.id, // Store document ID
        ...doc.data(), // Spread the post data
      }));

      // Sort posts by timestamp (newest first)
      postsData.sort((a, b) => {
        const timestampA = a.timestamp ? a.timestamp.toMillis() : 0; // Get timestamp in milliseconds
        const timestampB = b.timestamp ? b.timestamp.toMillis() : 0;
        return timestampB - timestampA; // Sort in descending order
      });

      setPosts(postsData);
    };

    const fetchMovies = async () => {
      const moviesCollection = collection(db, 'movies'); // Reference to the 'movies' collection
      const moviesSnapshot = await getDocs(moviesCollection); // Fetch the documents
      const moviesData = moviesSnapshot.docs.map(doc => ({
        id: doc.id, // Store document ID
        ...doc.data(), // Spread the movie data
      }));

      setMovies(moviesData);
    };

    fetchPosts();
    fetchMovies();
  }, []);

  // Calculate the indices for the current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Calculate total pages
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="app">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" /> {/* Add logo image */}
      </header>
      <div className="content">
        <div className="list-container">
          <ul className="list">
            {currentPosts.map((post, index) => (
              <li key={index} className="list-item">
                {post.content}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Movie List Section */}
        {/* <div className="movies-panel">
          <h3>Movies/Series Recommandation</h3>
          <ul className="movies-list">
            {movies.map((movie, index) => (
              <li key={index} className="movies-item">
                {movie.title}
              </li>
            ))}
          </ul>
        </div> */}
      </div>
      
      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
