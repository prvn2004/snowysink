import React, { useEffect, useState } from 'react';
import firebase from './Firebase';

const App = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const db = firebase.firestore();
      const postsCollection = await db.collection('posts').get();
      const postsData = postsCollection.docs.map(doc => doc.data());
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post, index) => (
        <div key={index}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
