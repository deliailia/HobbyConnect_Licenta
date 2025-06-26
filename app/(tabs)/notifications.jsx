import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import React, { use, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { ngrokLink } from '../ngrokLink';
import { useSearchParams } from 'expo-router';
import { StyleSheet, TextInput, Modal } from 'react-native';




const ngrokBaseUrl = ngrokLink;

const Notifications = () => {
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReqId, setUserReqId] = useState(null); 
  const router = useRouter();
  const [isMember, setIsMember] = useState(false);
  const [testResults, setTestResults] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
const [finalActivity, setFinalActivity] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [definition, setDefinition] = useState('');
const [introduction, setIntroduction] = useState('');
const [traits, setTraits] = useState([]); // listă
const [lifestyle, setLifestyle] = useState('');
const [whatFitsYouBest, setWhatFitsYouBest] = useState('');
  //console.log("Notifications context:", { requests, updateRequests });
const [finalCategory, setFinalCategory] = useState('');
const [finalGroup, setFinalGroup] = useState(''); 
  const [searchModalVisible, setSearchModalVisible] = useState(false);
const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
    const [searched, setSearched] = useState(false);
const [usernameInput, setUsernameInput] = useState('');
const [subgroupScoresMessage, setSubgroupScoresMessage] = useState(null);
const [subgroupResults, setSubgroupResults] = useState([]);
const [showEnterSubgroupButton, setShowEnterSubgroupButton] = useState(true);
const [recommendedSubgroup, setRecommendedSubgroup] = useState(null);
const [userId, setUserId] = useState(null);
const [showEnterButtons, setShowEnterButtons] = useState(true);


  const checkMembership = async (username, subcategoryName, categoryName) => {
    try {
            const url = `${ngrokBaseUrl}/arts/${categoryName}/${subcategoryName}`;  
            console.log('Checking membership for URL:', url); // Debugging log
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (response.status === 200) {
        const memberExists = data.members.some((member) => member.username === username);
        setIsMember(memberExists);  
        setShowEnterSubgroupButton(!memberExists);
        return memberExists;
      } else {
        console.error('Error checking members:', data.message);
      }
    } catch (error) {
      console.error('Error verifying members:', error);
    }
  };
  

  const getRequests = async (adminId, username) => {
    try {
      const adminId = await AsyncStorage.getItem('userId'); 
      const username = await AsyncStorage.getItem('username');
  
      if (!adminId || !username) {
        Alert.alert('Error', 'Admin ID or username not found. Please login again.');
        router.push('/sign-in');
        return;
      }
      const url = `${ngrokBaseUrl}/requests/get-requests?adminId=${adminId}&username=${username}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) { throw new Error('Error getting requests.');}
      const data = await response.json(); 
      const filteredRequests = await Promise.all(data.map(async (request) => {
        const memberExists = await checkMembership(request.username, request.subcategoryName, request.categoryName);
        const isMember = await checkMembership(request.username, request.subcategoryName, request.categoryName);
        return isMember ? null : request;  
      }));
        const validRequests = filteredRequests.filter(request => request !== null);
      setRequests(validRequests); 
    } catch (error) {
      console.error('Error getting requests', error);
      Alert.alert('Error', 'Couldn\'t get requests');
    }
  };
  

  const getTestResult = async (username) => {
    try {
      console.log('Fetching test result for User:', username); 
      const url = `${ngrokBaseUrl}/getTestResultMBTI/${username}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();  
      if (response.ok && data) {
        if (data.testResults  && data.testResults.length > 0) {         
            setTestResults(data.testResults);
        } else {
          console.warn('No test results found for user:', username); 
          setTestResults([]); 
        }
      } else {
        throw new Error(data.message || 'Error getting test results');
      }
    } catch (error) {
      console.error('Error getting test result', error);
      setTestResults([]); 
    }
  };

  const getSubgroupResults = async (username) => {
  try {
    if(role === 'admin_master') {
      return []
    }
    const url = `${ngrokBaseUrl}/testResults/getTestResult/${username}`;
    console.log('Fetching subgroup results for :', url); // Debugging log
    const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' }});
    const data = await response.json();

    if (response.ok && data) {
        // Presupun că e un array, iau primul rezultat
        processSubgroupScores(data);
        setSubgroupResults(data);
       
      console.log('Subgroup results:', data); // Debugging log
    } else {
      throw new Error(data.message || 'Error getting subgroup results');
    }
  } catch (error) {
    console.error('Error getting subgroup results', error);
    setSubgroupScoresMessage('Take test first');
    setSubgroupResults([]);
  }
};
useEffect(() => {
  if (userName) {
    getSubgroupResults(userName);
  }
}, [userName]);




const processSubgroupScores = (data) => {
  if (!data) return;

  const categories = [
    { key: 'sportScores', label: 'Sport' },
    { key: 'indoorScores', label: 'Indoor' },
    { key: 'outdoorScores', label: 'Outdoor' },
    { key: 'artScores', label: 'Art' },
    { key: 'languagesScores', label: 'Language',  backendKey: 'Language'  },
  ];

  let groupsWithScores = [];
  let maxScore = -1;
  let finalCategory = null;
  let finalGroup = null;

  categories.forEach(({ key, label }) => {
    const scores = data[key];
    if (scores) {
      Object.entries(scores).forEach(([group, score]) => {
        if (score > 0) {
          groupsWithScores.push(group);

          if (score > maxScore) {
            maxScore = score;
            finalCategory = label;
            finalGroup = group;
          }
        }
      });
    }
  });

  groupsWithScores = [...new Set(groupsWithScores)];

  if (groupsWithScores.length === 0) {
    setSubgroupScoresMessage('No scores found in test');
    return;
  }

  // Mesaj construit din grupuri și scor maxim
  const message = `Among your responses, the groups ${groupsWithScores.join(', ')} were dominating. The category ${finalCategory}: ${finalGroup} we think fits you the best`;

  setSubgroupScoresMessage(message);
  console.log('Final Category:', finalCategory);
  const category = categories.find(c => c.label === finalCategory);
setRecommendedSubgroup({
  categoryName: finalCategory,// ce trimitem la backend
  subcategoryName: finalGroup.toLowerCase(), // trimitem numele subcategoriei în lowercase
});
  };





const handleEnterSubgroup = async () => {
   
 // setEnteredSubgroup(true);
   console.log("handleEnterSubgroup triggered");
 console.log('Recommended Subgroup:', recommendedSubgroup);
  console.log('User Name:', userName);
  console.log('User ID:', userId); 
     const { categoryName, subcategoryName } = recommendedSubgroup;


  if (!recommendedSubgroup || !userName || !userId) {
    console.warn("Missing user or subgroup info");
    return;
  }

  console.log('Entering subgroup:', subcategoryName, 'in category:', categoryName);
  const isMember = await checkMembership(userName, subcategoryName, categoryName);
  console.log('Membership check result:', isMember);
  if (isMember) {
        console.log('User is already a member of the subgroup');

    setShowEnterButtons(false); // ascundem butoanele dacă e deja membru
    return;
  }
 

  try {
    const url = `${ngrokBaseUrl}/arts/add-user`;
    console.log('Adding user to subgroup with URL:', url); 
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryName,
        subcategoryName, // trimitem numele subcategoriei în lowercase
        username: userName,
        userReqId: userId,
      }),
    });

    const data = await response.json();

    if (response.status === 201) {
      console.log('User added successfully:', data.message);
      setShowEnterButtons(false); // ascundem butoanele după adăugare
    } else {
      console.error('Failed to add user:', data.message);
    }
  } catch (error) {
    console.error('Error adding user to group:', error);
  }
};
// useEffect(() => {
//   if (enteredSubgroup) {
//     console.log('User just entered subgroup!');
//   }
// }, [enteredSubgroup]);

useEffect(() => {
  if (role === 'user' && userName && recommendedSubgroup) {
    checkMembership(userName, recommendedSubgroup.subcategoryName, recommendedSubgroup.categoryName)
      .then(memberExists => {
        setIsMember(memberExists);
        setShowEnterSubgroupButton(!memberExists);
      });
  }
}, [userName, recommendedSubgroup, role]);

  
  const handleDismissTest = () => {
    setTestResults(null);  
  
    Toast.show({
      type: 'success',
      text1: 'Notification dismissed!',
      text2: 'Test result removed from notifications',
      visibilityTime: 3000,
      autoHide: true,
    });
  };
  

  const getUserDetails = async () => {
    try {
      
      const email = JSON.parse(await AsyncStorage.getItem('userEmail'));
      
      if (!email) {
        console.error("Email not found in AsyncStorage!");
        Alert.alert('Error', 'Email not found. Please login again.');
        router.push('/sign-in');
        return;
      }
  
     
      console.log("Email from AsyncStorage:", email); // Debugging log

      const url = `${ngrokBaseUrl}/users/by-email/${email}`;
      console.log("url:", url); // Debugging log
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error at getting details about user');
      }

      const data = await response.json();
      if (data.role) {
        setRole(data.role);
      }
      if (data.username) {
        await AsyncStorage.setItem('username', data.username); // Salvează username
        setUserName(data.username); // Setează starea pentru username
        console.log('Username saved:', data.username); // Log pentru debugging
      } else {
        console.error('Username not found in response.');
      }
       if (data.userId) {
        await AsyncStorage.setItem('userId', data.userId);
        setUserId(data.userId); 
        console.log('UserId saved:', data.userId); // Debugging log
      } else {
        console.error('UserId not found in response.');
      }

      const username = data.username;
      const adminId = data.userId; // Obținem adminId din detaliile utilizatorului


      if (data.role === 'admin_master') {
        await getRequests(adminId, username);
      } else if (data.role === 'user') {
        await getTestResult(username);
      }
    } catch (error) {
      console.error('Error getting details user:', error);
      Alert.alert('Error', 'Error getting details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoleAndUserName = async () => {
      try {
        await getUserDetails();
      } catch (error) {
        console.error('Error getting details user', error);
      }
    };

    fetchRoleAndUserName();
  }, []);

  const handleDismiss = (index) => {
    setRequests((prevRequests) => {
      const updatedRequests = [...prevRequests];
      updatedRequests.splice(index, 1);  
      return updatedRequests;
    });
    Toast.show({
      type: 'success',
      text1: 'Request denied!',
      text2: 'Request eliminated from notifications',
      visibilityTime: 3000,
      autoHide: true,
      text1Style: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      text2Style: {
        fontSize: 16,
      },
    });
  };
  const handleSeeResults = ( finalActivity) => {
    console.log('Navigating to test results with params:', finalActivity);
    // Navighează la pagina /testResults și trece id-ul ca query param
    router.push({
    pathname: '/testResults',
  params: { finalActivity: testResults.finalActivity },
});
  }

const addAnalysis = async ({ finalActivity, adminUsername,definition,
            introduction, traits, lifestyle, whatFitsYouBest}) => {
  try {
    const url = `${ngrokBaseUrl}/add-analyze-test`;
    console.log('Sending analysis to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({finalActivity, adminUsername, definition,
        introduction, traits, lifestyle, whatFitsYouBest,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      Alert.alert('Success', 'Success!');
      setModalVisible(false);
      setFinalActivity('');
      setAdminUsername('');
      setDefinition('');
      setIntroduction('');
      setTraits([]);
      setLifestyle('');
      setWhatFitsYouBest('');

    } else {
      Alert.alert('Error', result.message || 'Error saving.');
    }
  } catch (error) {
    Alert.alert('Error', 'Could not save analysis.');
    console.error(error);
  }
};
useEffect(() => {
  if (userName && role === 'user') {
    getSubgroupResults(userName);
  }
}, [userName, role]);


const handleSubmit = () => {
  if (
    !finalActivity || !adminUsername || !definition ||
    !introduction || !lifestyle || !whatFitsYouBest || !traits.length
  ) {
    Alert.alert('Warning', 'Complete all fields before submitting.');
    return;
  }

  addAnalysis({
    finalActivity, adminUsername, definition,
    introduction, traits, lifestyle, whatFitsYouBest
  });
};
 const handleSearch = () => {
    const filtered = requests.filter(req => req.username.toLowerCase().includes(usernameInput.toLowerCase()));
    setFilteredRequests(filtered);
    setSearched(true);
  };
const displayRequests = (filteredRequests.length > 0 ? filteredRequests : requests) || [];



  return (
    <LinearGradient
      colors={['#FFF7AD', '#FF9F9A']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <SafeAreaView>
          <View className="flex-1">
            <Text className="text-3xl font-bold ml-5 p-6 mb-12">
              Welcome, {userName}!
            </Text>

            {role === 'admin_master' ? (
              <>
              <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
  <TextInput
    placeholder="Search by username"
    placeholderTextColor="#888"
    value={usernameInput}
    onChangeText={setUsernameInput}
    onSubmitEditing={handleSearch}
    style={{
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
    }}
  />
  
</View>



  
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.openButton}
      >
        <Text style={styles.buttonText}>Add analysis</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Complete analysis</Text>

            <TextInput
              placeholder="Type"
              placeholderTextColor="#888"
              value={finalActivity}
              onChangeText={setFinalActivity}
              style={styles.input}
            />
            <TextInput
              placeholder="Username"
              placeholderTextColor="#888"
              value={adminUsername}
              onChangeText={setAdminUsername}
              style={styles.input}
            />
            
           
            <TextInput
              placeholder="Definition"
              placeholderTextColor="#888"
              value={definition}
              onChangeText={setDefinition}
              style={[styles.input, { height: 80 }]}
              multiline={true}
            />
            <TextInput
              placeholder="Introduction"
              placeholderTextColor="#888"
              value={introduction}
              onChangeText={setIntroduction}
              style={[styles.input, { height: 80 }]}
              multiline={true}
            />
            <TextInput
              placeholder="Lifestyle"
              placeholderTextColor="#888"
              value={lifestyle}
              onChangeText={setLifestyle}
              style={[styles.input, { height: 80 }]}
              multiline={true}
            />
            <TextInput
              placeholder="Traits"
              placeholderTextColor="#888"
              value={traits}
              onChangeText={setTraits}
              style={[styles.input, { height: 80 }]}
              multiline={true}
            />
            <TextInput
              placeholder="What Fits You Best"
              placeholderTextColor="#888"
              value={whatFitsYouBest}
              onChangeText={setWhatFitsYouBest}
              style={[styles.input, { height: 80 }]}
              multiline={true}
            />
            

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.button, { backgroundColor: '#aaa' }]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.button, { backgroundColor: '#FF9F9A' }]}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>

                <View className="p-5 rounded-lg mt-5">
                  <Text className="text-xl font-bold mb-4">Requests:</Text>
                   {displayRequests.length > 0 ? (
        displayRequests.map((request, index) => (
                      <View
                        key={index}
                        className="bg-pink-100 rounded-lg shadow-sm p-4 mb-4"
                      >
                        <Text className="text-lg text-gray-800 mb-2">
                          Group: {request.categoryName}, Username: {request.username}, Admin ID: {request.adminId}
                        </Text>
                        <View className="flex-row justify-between mt-2">
                          <TouchableOpacity
                            className="bg-red-500 rounded-lg p-2 flex-1 mr-2"
                            onPress={() => handleDismiss(index)}
                          >
                            <Text className="text-center text-white font-bold">
                              Dismiss
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="bg-blue-500 rounded-lg p-2 flex-1 ml-2"
                            onPress={() => 
                            {console.log('Navigating to userReqDet with params:', request);
                              router.push({
                                pathname: '/(pages)/userReqDet',
                                params: {
                                  username: request.username,
                                  adminId: request.adminId,
                                  userReqId: request.userReqId,
                                  categoryName: request.categoryName,
                                  subcategoryName: request.subcategoryName ,
                                  profileImage: request.profileImage,
                                },
                              })}
                            }
                          >
                            <Text className="text-center text-white font-bold">
                              See Details
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text className="text-lg text-gray-800">No requests found</Text>
                  )}
                </View>
              </>
             ) : role === 'user' && testResults && testResults.length > 0 ? (
              <>
                <Text className="text-xl font-bold mb-4">Test Notification:</Text>

{subgroupScoresMessage && (
  <View className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
    <Text className="text-lg font-semibold text-blue-800 mb-2">Subgroup Analysis</Text>
    <Text className="text-gray-800 mb-4">{subgroupScoresMessage}</Text>

    {recommendedSubgroup && !isMember && (
  <View className="flex-row space-x-4">
    <TouchableOpacity
      onPress={() => {
        handleEnterSubgroup(finalCategory, finalGroup);
        setShowEnterButtons(false);
      }}
      className="bg-blue-600 px-4 py-2 rounded-lg flex-1"
    >
          <Text className="text-white text-center font-semibold">Enter Subgroup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-300 px-4 py-2 rounded-lg flex-1"
          onPress={() => {
            console.log('Learn more about subgroup');
          }}
        >
          <Text className="text-gray-800 text-center font-semibold">Learn More</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
)}


                {testResults.map((test) => (
                  <View
                    key={test._id}
                    className="bg-pink-100 rounded-lg shadow-sm p-4 mb-4"
                  >
                    <Text className="text-lg text-gray-800 mb-2">
                      You have completed the {test.testName} test!
                    </Text>
                    <Text className="text-gray-700 mb-2">Check your result</Text>

                    

                    <View className="flex-row justify-between mt-4">
                      <TouchableOpacity
                        className="bg-red-500 rounded-lg p-2 flex-1 mr-2"
                        onPress={handleDismissTest}
                      >
                        <Text className="text-center text-white font-bold">Dismiss</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-green-500 rounded-lg p-2 flex-1"
                  onPress={() => 
                  {console.log('Navigating to test results with params:', test.finalActivity, test.username);
                    router.push({
                                    pathname: '/testResults',
                                    params: { finalActivity: test.finalActivity, username: test.username},
        })}}
                      >
                        <Text className="text-center text-white font-bold">See Results</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <View className="p-5 rounded-lg mt-5 bg-white shadow-sm">
                <Text className="text-lg text-gray-800 text-center">
                  No test results available.
                </Text>
              </View>
            )}


  

            
          </View>
          <Toast />
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  openButton: {
    backgroundColor: '#FF9F9A',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 8,
  },
});

export default Notifications;
