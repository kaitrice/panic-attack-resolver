import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import {colors} from '../values/colors'

const HotlineSOS = () => {
  const [showHotlineOptions, setShowHotlineOptions] = useState (false);

  const toggleHotlineOptions = () => {
    setShowHotlineOptions (!showHotlineOptions);
  };

  const handleCallHotline = number => {
    Linking.openURL (`tel:${number}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.heading}>Need Someone to Talk To?</Text>
        <Text style={styles.infoText}>
          If you're feeling overwhelmed and need someone to talk to, we're here
          for you. Would you like to call a hotline?
        </Text>

        <TouchableOpacity
          onPress={toggleHotlineOptions}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleButtonText}>
            {showHotlineOptions ? 'Hide Hotlines' : 'Show Hotlines'}
          </Text>
        </TouchableOpacity>

        {showHotlineOptions &&
          <View>
            <TouchableOpacity
              onPress={() => handleCallHotline ('741741')}
              style={styles.hotlineButton}
            >
              <Text style={styles.hotlineButtonText}>
                Crisis Text Line (Text HELLO to 741741)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCallHotline ('1-866-903-3787')}
              style={styles.hotlineButton}
            >
              <Text style={styles.hotlineButtonText}>
                Mental Health Anxiety Hotline (1-866-903-3787)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCallHotline ('1-800-273-8255')}
              style={styles.hotlineButton}
            >
              <Text style={styles.hotlineButtonText}>
                Crisis Support Services (1-800-273-8255)
              </Text>
            </TouchableOpacity>
          </View>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  heading: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
    textAlign: 'center',
  },
  toggleButton: {
    backgroundColor: '#997950',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hotlineButton: {
    backgroundColor: colors.sosButtonColor,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  hotlineButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HotlineSOS;