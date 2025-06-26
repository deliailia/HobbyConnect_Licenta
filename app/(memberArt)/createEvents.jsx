import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PollMessage = ({ poll, onVote }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);

  // Verifică dacă userul a votat deja (dacă ai username)
  // Exemplu: username vine din props sau context
  const currentUserVote = poll.members.find(m => m.username === poll.currentUser);

  const handleVote = (choice) => {
    setSelectedChoice(choice);
    onVote(poll._id, choice);  // Apelează funcția vote din parent
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{poll.question}</Text>
      
      {/* Afișează opțiunile */}
      {poll.options.map((opt, i) => {
        // Calculează câți membri au votat pentru optiunea asta
        const votesCount = poll.members.filter(m => m.choice === opt).length;
        const isSelected = selectedChoice === opt || currentUserVote?.choice === opt;

        return (
          <TouchableOpacity
            key={i}
            style={[styles.optionButton, isSelected && styles.selectedOption]}
            disabled={!!currentUserVote} // Dacă userul a votat deja, dezactivează butoanele
            onPress={() => handleVote(opt)}
          >
            <Text style={styles.optionText}>{opt} ({votesCount})</Text>
          </TouchableOpacity>
        );
      })}

      {currentUserVote && (
        <Text style={styles.votedText}>Ai votat: {currentUserVote.choice}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eef2f5',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 12,
  },
  question: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  optionButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
  },
  selectedOption: {
    backgroundColor: '#4ade80',
  },
  optionText: {
    fontSize: 14,
  },
  votedText: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#444',
  },
});

export default PollMessage;
