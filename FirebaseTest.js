import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Cấu hình Firebase 
const firebaseConfig = {
  apiKey: "AIzaSyADtRWRQNGIYOEWLCNfmuQoa_nRT7cnvEw",
  authDomain: "applist-3e62e.firebaseapp.com",
  projectId: "applist-3e62e",
  storageBucket: "applist-3e62e.firebasestorage.app",
  messagingSenderId: "199010426925",
  appId: "1:199010426925:web:918650021c2ada4ad618a4",
};

console.log('Initializing Firebase with config:', firebaseConfig);

// Khởi tạo Firebase
let app;
let db;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

const FirebaseTest = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra kết nối Firebase
    try {
      if (app) {
        setIsConnected(true);
        console.log('🔥 Firebase connected successfully');
      } else {
        setError('Firebase app not initialized');
        console.error('Firebase app not initialized');
      }
    } catch (error) {
      console.error('🚫 Firebase connection error:', error);
      setError(error.message);
      setIsConnected(false);
    }

    
    if (db) {
      console.log('Setting up Firestore listener...');
      const messagesRef = collection(db, 'test_messages');
      const unsubscribe = onSnapshot(messagesRef, 
        (snapshot) => {
          console.log('Received Firestore update:', snapshot.docs.length, 'documents');
          const newMessages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMessages(newMessages);
        },
        (error) => {
          console.error('Error in Firestore listener:', error);
          setError(error.message);
        }
      );

      return () => {
        console.log('Cleaning up Firestore listener...');
        unsubscribe();
      };
    }
  }, []);

  const addMessage = async () => {
    if (!db) {
      console.error('Firestore not initialized');
      setError('Firestore not initialized');
      return;
    }

    try {
      console.log('Adding new message:', message);
      const messagesRef = collection(db, 'test_messages');
      await addDoc(messagesRef, {
        text: message,
        timestamp: serverTimestamp()
      });
      console.log('Message added successfully');
      setMessage('');
    } catch (error) {
      console.error('Error adding message:', error);
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        Firebase Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}
      </Text>
      
      {error && (
        <Text style={styles.error}>
          Error: {error}
        </Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Nhập tin nhắn test..."
        />
        <Button title="Gửi" onPress={addMessage} />
      </View>

      <View style={styles.messagesContainer}>
        <Text style={styles.title}>Tin nhắn:</Text>
        {messages.map((msg) => (
          <Text key={msg.id} style={styles.message}>
            {msg.text}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  messagesContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 5,
    borderRadius: 5,
  },
});

export default FirebaseTest;
