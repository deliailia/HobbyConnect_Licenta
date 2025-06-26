import React, { useEffect } from 'react';
import { Alert } from 'react-native';

const checkTokenExpiration = () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzdhNDVlNDRiOGQzODVmODZiNThkNTciLCJ1c2VybmFtZSI6ImkiLCJpYXQiOjE3MzYwNzkyNzYsImV4cCI6MTczNjEwMDg3Nn0.TNJcLgSkqWisNKNlOgmZ98ST090am_CYaRV9Fkzk7UY"; 

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); 
    const expirationDate = new Date(decodedToken.exp * 1000); 
    console.log("Expires on: ", expirationDate);
    
    
    const currentDate = new Date();
    if (currentDate > expirationDate) {
      Alert.alert("Token Expired", "Login");
    }
  } catch (error) {
    console.error("Erorr decoding token ", error);
  }
};

const MyComponent = () => {
  useEffect(() => {
    checkTokenExpiration(); 
  }, []);

  return (
    
    <></>
  );
};

export default MyComponent;
