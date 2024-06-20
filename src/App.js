import React, { useState, useEffect } from 'react';
import firebase from './firebase';
import './App.css';

const generateRandomUserId = () => {
  return Math.random().toString(36).substr(2, 10); // Random alphanumeric string
};

function App() {
  const [text, setText] = useState('');
  const [userColor] = useState('#FFFFFF'); // Fixed color for all users
  const [userId] = useState(generateRandomUserId()); // Generate a random user ID
  const [isOnline, setIsOnline] = useState(false); // Online status indicator
  const [tabActive, setTabActive] = useState(!document.hidden); // Track if tab is active

  useEffect(() => {
    const userStatusDatabaseRef = firebase.database().ref('.info/connected');
    const usersOnlineRef = firebase.database().ref('users');
    const syncTextRef = firebase.database().ref('synced-text'); // Reference to synced text in Firebase

    // Listen for changes in text
    syncTextRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setText(data.text); // Update local text based on Firebase data
      }
    });

    // Update user status when connected or disconnected
    const setUserOnlineStatus = (onlineStatus) => {
      const userRef = usersOnlineRef.child(userId);
      userRef.set({
        userId,
        online: onlineStatus,
      });

      userRef.onDisconnect().remove(); // Remove user from online list on disconnect
    };

    // Function to check if tab is active
    const checkTabActive = () => {
      setTabActive(!document.hidden);
    };

    // Polling to check tab activity every 1 second
    const tabActiveInterval = setInterval(checkTabActive, 1000);

    // Event listener for visibility change
    document.addEventListener('visibilitychange', checkTabActive);

    // Monitor changes in online users
    usersOnlineRef.on('value', (snapshot) => {
      const users = snapshot.val();
      if (users) {
        const activeUsers = Object.values(users).filter(user => user.online && user.userId !== userId);
        setIsOnline(activeUsers.length > 0);
      }
    });

    // Set initial user status
    setUserOnlineStatus(true);

    // Cleanup function
    return () => {
      clearInterval(tabActiveInterval);
      userStatusDatabaseRef.off();
      usersOnlineRef.off();
      document.removeEventListener('visibilitychange', checkTabActive);
      setUserOnlineStatus(false); // Set user offline on unmount
    };
  }, [userId]);

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText); // Update local text immediately

    // Update only the 'text' field in Firebase without overwriting other fields
    firebase.database().ref('synced-text').update({
      text: newText,
      timestamp: Date.now(), // Optionally update timestamp
      userColor,
      userId,
    });
  };

  return (
    <div className="App">
      <div className="status-indicator">
        <div className={`dot ${isOnline && tabActive ? 'online' : 'offline'}`}></div>
        <span>{isOnline && tabActive ? 'Online' : 'Offline'}</span>
      </div>
      <div className="editor-container">
        <textarea
          className="editor"
          value={text}
          onChange={handleTextChange}
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
}

export default App;