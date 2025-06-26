import { View, Text, ActivityIndicator, Button, Modal, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { images } from '../../constants';
import { Image } from 'react-native';
import { ngrokLink } from '../ngrokLink';


const checkTokenExpiration = (token) => {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); 
    const expirationDate = new Date(decodedToken.exp * 1000); 
    console.log("Expires on: ", expirationDate);

    const currentDate = new Date();
    if (currentDate > expirationDate) {
      Alert.alert("Token Expired", "Login again");
    
      router.push('/login');
      return false;
    }
    return true;
  } catch (error) {
    console.error("Erorr decoding token ", error);
    return false;
  }
};

const getRandomImage = () => {
  const imageList = [
    images.draw1, images.choreo1, images.art1, images.photo1, images.photo2, images.draw2
    
  ];

  const randomIndex = Math.floor(Math.random() * imageList.length);
  return imageList[randomIndex];
};


const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const ngrokBaseUrl = ngrokLink;


const Art = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0); 
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]); 
  const [showFinalMessage, setShowFinalMessage] = useState(false); 
  const [dominantGroup, setDominantGroup] = useState(""); 
  const [backgroundImage, setBackgroundImage] = useState(getRandomImage()); 

  const router = useRouter();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const url = `${ngrokBaseUrl}/questions/category/art`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch question');
        }
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
          
          const shuffledQuestions = shuffleArray(data);
          setQuestions(shuffledQuestions); 
        } else {
          setError("No questions available.");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching questions:", err); 
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, []);

  const handleAnswerSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) {
      alert("Please select an answer before proceeding.");
      return;
    }

    
    const newAnswer = {
      question: questions[questionIndex].question,
      selectedOption: selectedOption,
    };
    setUserAnswers([...userAnswers, newAnswer]);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1); 
      setSelectedOption(null); 
      setBackgroundImage(getRandomImage());
    } else {
      saveTestResults(); 
      setShowFinalMessage(true);  
    }
  };

  const handleCancelTest = () => {
    setUserAnswers([]);
    setQuestionIndex(0);
    setSelectedOption(null);
    router.push('/home'); 
  };

  const saveTestResults = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('UserId from AsyncStorage:', userId);
      if (!userId) {
        console.error('UserId not found.');
        return;
      }
  
      const results = userAnswers.map(answer => ({
        question: answer.question,  
        answer: answer.selectedOption,  
      }));
      const url = `${ngrokBaseUrl}/testResults/saveTestResult`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          //'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testName: 'art', 
          questions: results,  
          userId: userId,  
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setDominantGroup(data.finalArt); 
        alert('Results have been saved!');
      } else {
        alert('Error at saving results.');
      }
    } catch (error) {
      console.error('Error at sending test results:', error);
      alert('Try later, there has been an error');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const question = questions[questionIndex];

  return (
    <SafeAreaView className="flex-1 bg-acol p-6 justify-center items-center">
    <View style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'relative',
      }}>
      <Image
        source={backgroundImage}  
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '120%',
          opacity: 0.2,
        }}
      />
    
      {question ? (
        <>
          <View style={{ width: '100%' }}>
            <Text className=" text-center text-3xl text-black mb-9"
                  style={{  textAlign: 'center' , height: 100, lineHeight: 30 }}
            >
              {question.question}
            </Text>
          </View>
          
          {question.options.map((option, index) => (
            <View key={index} className="mb-5">
              <TouchableOpacity
                onPress={() => handleAnswerSelect(option)}
                activeOpacity={0.9}
                className={`flex-row items-center border-2 border-${selectedOption === option ? 'white' : 'black'} rounded-lg p-4 w-[300px] h-[95px] justify-between`}
              >
                <View
                  className={`w-6 h-6 rounded-full border-2 border-black ${selectedOption === option ? 'bg-acol2' : 'bg-transparent'} absolute left-[-50px]`}
                >
                  {selectedOption === option && (
                    <View className="w-4 h-4 bg-black rounded-full" />
                  )}
                </View>

                <Text className=" text-lg text-black">
                  {option}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            onPress={handleNextQuestion}
            className="border-2 border-orange-500 rounded-lg bg-acol2 p-4 mt-5"
          >
            <Text className="text-black text-center text-base">Next Question</Text>
          </TouchableOpacity>
          
          {questionIndex < questions.length - 1 && (
            <TouchableOpacity   onPress={handleCancelTest} 
                    color="red" 
                    className="border-2 border-red-500 rounded-lg bg-red-400 mt-5 w-[250px] h-[40px] justify-center" >
                 <Text style={{ color: 'black', fontSize: 16, textAlign: 'center' }}>Cancel Test</Text>   
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text style={{ color: '#fff' }}>No question available.</Text>
      )}

      
      <Modal
        visible={showFinalMessage}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFinalMessage(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Test Finished! Thank you for participating.</Text>
            {dominantGroup ? (
              <Text style={{ fontSize: 16, color: 'blue', marginBottom: 20 }}>
              </Text>
            ) : (
              <Text> </Text>
            )}
            <Button
              title="Go to Home"
              onPress={() => {
                setShowFinalMessage(false);  
                router.push('/home'); 
              }}
            />
          </View>
        </View>
      </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Art;
