import React, { useEffect, useState } from 'react';
import { db } from '../src/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import './App.css';
import logo from './logo.jpg';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, 'posts');
      const postsSnapshot = await getDocs(postsCollection);
      const postsData = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      postsData.sort((a, b) => {
        const timestampA = a.timestamp ? a.timestamp.toMillis() : 0;
        const timestampB = b.timestamp ? b.timestamp.toMillis() : 0;
        return timestampB - timestampA;
      });

      setPosts(postsData);
    };

    const fetchMovies = async () => {
      const moviesCollection = collection(db, 'movies');
      const moviesSnapshot = await getDocs(moviesCollection);
      const moviesData = moviesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMovies(moviesData);
    };

    fetchPosts();
    fetchMovies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      try {
        await addDoc(collection(db, 'messages'), {
          content: message,
          timestamp: new Date(),
        });
        alert('Message submitted successfully!');
        setMessage('');
      } catch (error) {
        console.error('Error submitting message:', error);
        alert('Error submitting message. Please try again.');
      }
    } else {
      alert('Please enter a message.');
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="app">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
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
      </div>
      
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

      <div className="message-form">
        <h3>Leave a Text</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="message-input"
          />
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default App;
