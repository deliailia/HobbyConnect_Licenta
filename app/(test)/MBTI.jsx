import { View, Text, ActivityIndicator, Button, Modal, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { images } from '../../constants';
import { Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { ngrokLink } from '../ngrokLink';


const getRandomCategory = () => {
  const categories = [
    "Extraversion vs Introversion",
    "Judging vs Perceiving",
    "Feeling vs Thinking",
    "Sensing vs Intuition"
  ];
  const randomIndex = Math.floor(Math.random() * categories.length);
  const randomCategory = categories[randomIndex];
  //console.log("Generated Random Category:", randomCategory);
  return randomCategory;
};

const getRandomImage = () => {
  const imageList = [
    images.soccer1, images.soccer2, images.basket1, images.basket2, images.volley1, images.volley2,
    images.pilates1, images.pilates2, images.sports,
    images.art1, images.photo1, images.choreo1, images.draw1,
    images.italian2, images.korean2, images.french2, images.norvegian2, images.spanish2,
    images.travelling1, images.walking1, images.coffee2, images.food1,
     
    
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

const MBTI = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0); 
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]); 
  const [showFinalMessage, setShowFinalMessage] = useState(false); 
  const [dominantGroup, setDominantGroup] = useState(""); 
  const [backgroundImage, setBackgroundImage] = useState(getRandomImage()); 
  
  const initialRandomCategory = getRandomCategory();
  const [randomCategory, setRandomCategory] = useState(initialRandomCategory); 

  const router = useRouter();

 const processMBTIQuestionsByTip = (allQuestions) => {
  const groupedByTip = allQuestions.reduce((acc, question) => {
    if (!acc[question.tip]) {
      acc[question.tip] = [];
    }
    acc[question.tip].push(question);
    return acc;
  }, {});

  const tipsToSelect = ['I', 'E', 'S', 'T', 'J', 'P', 'F', 'N'];
  const selectedQuestions = [];
  tipsToSelect.forEach(tip => {
    const questionsForTip = groupedByTip[tip] || [];
    const shuffled = questionsForTip.sort(() => 0.5 - Math.random());
    selectedQuestions.push(...shuffled.slice(0, 4));
  });

  const finalShuffled = selectedQuestions.sort(() => 0.5 - Math.random());
  const lastQuestion = finalShuffled[finalShuffled.length - 1];
  if (lastQuestion) {
    const tip = lastQuestion.tip;
    const questionsForTip = groupedByTip[tip] || [];
    const existingQuestions = new Set(finalShuffled.map(q => q.question));
    const remainingQuestions = questionsForTip.filter(q => !existingQuestions.has(q.question));
    if (remainingQuestions.length > 0) {
      const extraQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
      finalShuffled.push(extraQuestion);
    }
  }

  return finalShuffled;
};


  useEffect(() => {
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      const url = `${ngrokBaseUrl}/mbti-questions`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        const processedQuestions = processMBTIQuestionsByTip(data);
setQuestions(processedQuestions);

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

  fetchQuestions();
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
      tip: questions[questionIndex].tip,
    };
      const updatedAnswers = [...userAnswers, newAnswer];
  setUserAnswers(updatedAnswers);
      if (questionIndex === questions.length - 1) {

    saveTestResults(updatedAnswers);
    setShowFinalMessage(true);
  } else {
    
    setUserAnswers(updatedAnswers);
    setQuestionIndex(questionIndex + 1);
    setSelectedOption(null);
    setBackgroundImage(getRandomImage());
  }

    
  };
 
 


  const handleCancelTest = () => {
    setUserAnswers([]);
    setQuestionIndex(0);
    setSelectedOption(null);
    router.push('/home'); 
  };
  
const saveTestResults = async (answersToSave) => {
  try {

    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.error('UserId not found.');
      return;
    }

    const results = userAnswers.map(entry => ({
      question: entry.question,
      answer: entry.selectedOption,
      tip: entry.tip,
    }));

    const url = `${ngrokBaseUrl}/saveResult`; 
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testName: 'MBTI', 
        questions: results,
        userId: userId,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('MBTI Scores:', data.scores);
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
    <ScrollView style={styles.scrollView}>
    <SafeAreaView className="flex-1 bg-rcol p-6 justify-center items-center">
    
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
          opacity: 0.3,
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
                  className={`w-6 h-6 rounded-full border-2 border-black ${selectedOption === option ? 'bg-rcol2' : 'bg-transparent'} absolute left-[-50px]`}
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
            className="border-2 border-orange-700 rounded-lg bg-rcol2 p-4 mt-5"
          >
            <Text className="text-black text-center text-base">Next Question</Text>
          </TouchableOpacity>
          
          {questionIndex < questions.length - 1 && (
            
            <TouchableOpacity   onPress={handleCancelTest} 
                    color="red" 
                    className="border-2 border-red-500 rounded-lg bg-red-400 mt-12 mb-5 w-[100px] h-[40px] justify-center absolute top-10 left-5" >
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
              <Text></Text>
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
    </ScrollView>
    
    
  );
};
const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: '#FC9D6D',  
    },
    
  });

export default MBTI;
