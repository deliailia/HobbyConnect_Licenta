import React, { useEffect, useState } from 'react';
import { 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView, 
  ScrollView, 
  View 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { ngrokLink } from '../ngrokLink';
import { Modal } from 'react-native';


const ngrokBaseUrl = ngrokLink;

const Card = ({ children }) => (
  <View style={{
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  }}>
    {children}
  </View>
);

const highlightWords = (text, keywords = []) => {
  if (!text) return null;

  // spargem textul în cuvinte, păstrând spațiile
  const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isHighlight = keywords.some(k => k.toLowerCase() === part.toLowerCase());
    return (
      <Text
        key={index}
        className={isHighlight ? 'text-red-600 font-ibold' : 'text-base font-iregular'}
      >
        {part}
      </Text>
    );
  });
};

const Accordion = ({ title, children, highlightKeywords = [] }) => {
  const [expanded, setExpanded] = useState(false);

  const renderContent = () => {
    if (typeof children === 'string') {
      const paragraphs = children.split('\n\n').filter(p => p.trim() !== '');
      return paragraphs.map((paragraph, idx) => {
        if (highlightKeywords.length > 0) {
          return (
            <Text key={idx} className="mb-3 leading-7 text-gray-700 text-base font-iregular">
              {highlightWords(paragraph, highlightKeywords)}
            </Text>
          );
        }
        return (
          <Text key={idx} className="mb-3 leading-7 text-gray-700 text-base font-iregular">
            {paragraph}
          </Text>
        );
      });
    }
    return children;
  };

  return (
    <Card>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
        className="flex-row justify-between items-center"
      >
        <Text className="text-2xl font-ibold text-red-500 py-3">{title}</Text>
        <Text className="text-xl text-red-500">{expanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      {expanded && <View>{renderContent()}</View>}
    </Card>
  );
};

const mbtiGroupSuggestions = {
  INFP: {
    groups: ['Art', 'Languages', 'Indoors'],
    motivation: 'Idealistic, creative personality, focused on inner expression and reflection',
  },
  INFJ: {
    groups: ['Art', 'Outdoors', 'Languages'],
    motivation: 'Creative, empathetic, drawn to artistic expression and personal exploration',
  },
  INTP: {
    groups: ['Indoors', 'Languages', 'Art'],
    motivation: 'Analytical, introverted, passionate about ideas and expression through writing or logical games',
  },
  INTJ: {
    groups: ['Indoors', 'Languages', 'Outdoors'],
    motivation: 'Strategic, independent, appreciates solitude and mentally engaging activities',
  },
  ISFP: {
    groups: ['Art', 'Outdoors', 'Sports'],
    motivation: 'Present-focused, aesthetically sensitive, connected to nature and physical experiences',
  },
  ISFJ: {
    groups: ['Outdoors', 'Indoors', 'Languages'],
    motivation: 'Caring, practical, oriented toward comfort and harmony',
  },
  ISTJ: {
    groups: ['Indoors', 'Outdoors', 'Sports'],
    motivation: 'Traditional, serious, appreciate stability and well-defined activities',
  },
  ISTP: {
    groups: ['Sports', 'Indoors', 'Outdoors'],
    motivation: 'Pragmatic, active, enjoy action and technology',
  },
  ENFP: {
    groups: ['Outdoors', 'Art', 'Languages'],
    motivation: 'Enthusiastic, expressive, eager for connection and new experiences',
  },
  ENFJ: {
    groups: ['Outdoors', 'Languages', 'Art'],
    motivation: 'Empathetic extroverts, talented in communication and expression',
  },
  ENTP: {
    groups: ['Indoors', 'Languages', 'Outdoors'],
    motivation: 'Curious, creative, inclined toward intellectual exploration and technology',
  },
  ENTJ: {
    groups: ['Indoors', 'Outdoors', 'Languages'],
    motivation: 'Strategic leaders who also value diverse experiences and cognitive stimulation',
  },
  ESFP: {
    groups: ['Outdoors', 'Art', 'Sports'],
    motivation: 'Energetic, live in the moment, love fun and creative expression',
  },
  ESFJ: {
    groups: ['Outdoors', 'Languages', 'Sports'],
    motivation: 'Sociable, community-oriented, and drawn to comfort',
  },
  ESTP: {
    groups: ['Sports', 'Outdoors', 'Indoors'],
    motivation: 'Spontaneous, action-driven, seeking thrills and hands-on experiences',
  },
  ESTJ: {
    groups: ['Sports', 'Indoors', 'Outdoors'],
    motivation: 'Organized, practical, enjoy structured and efficient activities',
  },
};




const TestResults = () => {
  const router = useRouter();
  const paramsFromRoute = useLocalSearchParams();

  const [finalActivity, setFinalActivity] = useState('');
  const [paramsLoaded, setParamsLoaded] = useState(false);
const [username, setUsername] = useState('');

  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [errorAnalysis, setErrorAnalysis] = useState(null);
const [showModal, setShowModal] = useState(false);

const [hasTakenTest, setHasTakenTest] = useState(false);
const [modalVisible, setModalVisible] = useState(false);
const [suggestedMessage, setSuggestedMessage] = useState(null);

  useEffect(() => {
    const loadParams = async () => {
      try {
        const { finalActivity: activityFromRoute, username: usernameFromRoute} = paramsFromRoute || {};
        const storedParams = await AsyncStorage.getItem('extraParams');
        const parsedParams = storedParams ? JSON.parse(storedParams) : {};
        const resolvedFinalActivity = activityFromRoute || parsedParams.finalActivity || 'Necunoscut';
        const resolvedUsername = usernameFromRoute || parsedParams.username || '';

        setFinalActivity(resolvedFinalActivity);
        setUsername(resolvedUsername);
      } catch (error) {
        setFinalActivity('Eroare');
      } finally {
        setParamsLoaded(true);
      }
    };
    loadParams();
  }, [paramsFromRoute]);

  useEffect(() => {
  const checkTestStatus = async () => {
    try {
      const url = `${ngrokBaseUrl}/testResults/getTestResult/${username}`;
      const res = await fetch(url);
      if (!res.ok) {
        setHasTakenTest(false);
        return;
      }
      const data = await res.json();
      console.log('Test status data:', data);
      if (data && data.status === 1) {
        setHasTakenTest(true);
      } else {
        setHasTakenTest(false);
      }
    } catch (err) {
      setHasTakenTest(false);
    }
  };
  if (username) {
    checkTestStatus();
  }
}, [username]);

useEffect(() => {
  if (finalActivity && mbtiGroupSuggestions[finalActivity]) {
    const suggestion = mbtiGroupSuggestions[finalActivity];
    setSuggestedMessage(
      `I suggest you to try the test from: ${suggestion.groups.join(', ')}.\n \n \n Why? Because: ${suggestion.motivation}`
    );
  } else {
    setSuggestedMessage(null); // sau un fallback gen: "No suggestions available."
  }
}, [finalActivity]);



  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!finalActivity || finalActivity === 'Necunoscut' || finalActivity === 'Eroare') {
        setAnalysis(null);
        return;
      }
      setLoadingAnalysis(true);
      setErrorAnalysis(null);
      try {
        const url = `${ngrokBaseUrl}/analysis/${finalActivity}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Server returned status ${response.status}`);
        const data = await response.json();
        if (!data || !data.analysis) {
          setErrorAnalysis('Analysis not found.');
          setAnalysis(null);
        } else {
          setAnalysis(data.analysis);
        }
      } catch (err) {
        setErrorAnalysis('Error analysis: ' + err.message);
        setAnalysis(null);
      } finally {
        setLoadingAnalysis(false);
      }
    };
    if (paramsLoaded) fetchAnalysis();
  }, [finalActivity, paramsLoaded]);

  if (!paramsLoaded || loadingAnalysis) {
    return (
      <LinearGradient colors={['#FFF7AD', '#FF9F9A']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF5C5C" />
        <Text style={{ fontSize: 16, marginTop: 12 }}>Loading...</Text>
      </LinearGradient>
    );
  }

  if (errorAnalysis) {
    return (
      <LinearGradient colors={['#FFF7AD', '#FF9F9A']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>{errorAnalysis}</Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/otherPersonalities', params: {finalActivity: finalActivity} })}
          style={{
            backgroundColor: '#FF5C5C',
            paddingHorizontal: 24,
            paddingVertical: 14,
            borderRadius: 12,
            marginTop: 20,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>See other personalities</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (!analysis) {
    return (
      <LinearGradient colors={['#FFF7AD', '#FF9F9A']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>No analysis found.</Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/otherPersonalities', params: {finalActivity: finalActivity} })}
          style={{
            backgroundColor: '#FF5C5C',
            paddingHorizontal: 24,
            paddingVertical: 14,
            borderRadius: 12,
            marginTop: 20,
          }}
        >
          <Text className="text-lg font-ibold text-white-500">See other personalities</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FFF7AD', '#FF9F9A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}>
          <Text className="text-3xl font-ibold text-red-500 mb-20 mt-2 align-center text-center">
            You are an {finalActivity}!
          </Text>

          
          <Accordion title="Definition">{analysis.definition}</Accordion>
          <Accordion title="Introduction">{analysis.introduction}</Accordion>
          <Accordion 
            title="Traits" 
            highlightKeywords={['Bold', 'Adventurous', 'Fearless', 'Risks', 'Exploring']}
          >
            {analysis.traits
              .split('\n')
              .filter(line => line.trim() !== '')
              .map((line, idx) => (
                <Text key={idx} className="text-base font-iregular text-gray-700 mb-2 leading-7">
                  {'\u2022'}{' '}
                  {highlightWords(line, ['Bold', 'Adventurous', 'Fearless', 'Risks', 'Exploring'])}
                </Text>
              ))}
          </Accordion>

          <Accordion title="Lifestyle">{analysis.lifestyle}</Accordion>
          <Accordion title="What fits you best">{analysis.whatFitsYouBest}</Accordion>

<TouchableOpacity
  onPress={() => setModalVisible(true)}
  style={{
    backgroundColor: '#FFB347',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 20,
    shadowColor: '#388E3C',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  }}
  activeOpacity={0.85}
>
  <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
    See what group you're in
  </Text>
</TouchableOpacity>



{hasTakenTest && (
  <Modal
    visible={modalVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.6)' }}>
      <View style={{ backgroundColor:'white', padding:20, borderRadius:16, width:'80%', alignItems:'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign:'center' }}>
          You already took the test
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 20, textAlign:'center' }}>
          But you can notify the admin to give you another chance.
        </Text>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={{
            backgroundColor: '#D84343',
            paddingVertical: 10,
            paddingHorizontal: 24,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}


{!hasTakenTest && (
  <Modal
    visible={modalVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.6)' }}>
      <View style={{ backgroundColor:'white', padding:20, borderRadius:16, width:'80%', alignItems:'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign:'center' }}>
          You haven't taken the test yet
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 20, textAlign:'center' }}>
          Please take the test first to see your group.
        </Text>
       {suggestedMessage && (
  <Text style={{ textAlign: 'center', marginTop: 10 }}>{suggestedMessage}</Text>
)}

        <TouchableOpacity
          onPress={() => {
            setModalVisible(false);
            router.push('/testIndex'); 
          }}
          style={{
            backgroundColor: '#388E3C',
            paddingVertical: 10,
            paddingHorizontal: 24,
            borderRadius: 12,
            marginBottom: 12,
            marginTop: 10,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Start Test</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={{
            backgroundColor: '#D84343',
            paddingVertical: 10,
            paddingHorizontal: 24,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}




          <TouchableOpacity
          onPress={() => router.push({ pathname: '/otherPersonalities', params: {finalActivity: finalActivity} })}
            style={{
              backgroundColor: '#D84343',
              paddingHorizontal: 28,
              paddingVertical: 14,
              borderRadius: 12,
              alignSelf: 'center',
              shadowColor: '#D84343',
              shadowOpacity: 0.4,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              marginTop: 10,
            }}
            activeOpacity={0.8}
          >
            <Text className="text-lg font-ibold text-white-500">
              See other personalities
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default TestResults;
