import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Audio } from 'expo-av'; 
import Ionicons from '@expo/vector-icons/Ionicons';

const AudioPlayer = ({ source, title, artworkUrl, onClose }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const initializeSound = async () => {
      const { sound: audioSound } = await Audio.Sound.createAsync(
        { uri: source },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(audioSound);
    };

    if (source) {
      initializeSound();
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [source]);

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && !status.isPlaying) {
      setIsPlaying(false);
    }
    if (status.isLoaded && status.isPlaying) {
      setIsPlaying(true);
      setDuration(status.durationMillis);
      setPosition(status.positionMillis);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) {
      return;
    }
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const stopAndUnloadSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  const handleClose = async () => {
    await stopAndUnloadSound();
    onClose();
  };

  const formatTime = (millis) => {
    if (millis == null) return '--:--';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.coverContainer}>
        <Image source={{ uri: artworkUrl }} style={styles.cover} />
      </View>
      <View style={styles.controls}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={togglePlayPause}>
          <Text>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
        <Text>{formatTime(position)}</Text>
        <Text>/</Text>
        <Text>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  cover: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default AudioPlayer;
