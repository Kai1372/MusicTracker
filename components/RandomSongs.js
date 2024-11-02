import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchSongsByIds } from './iTunesService';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioPlayer from './AudioPlayer';

const RandomSongs = ({ count, maxId }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    const getSongs = async () => {
      try {
        const songIds = generateUniqueRandomIds(count, maxId);
        const fetchedSongs = await fetchSongsByIds(songIds);
        const storedFavorites = await AsyncStorage.getItem('favorites');
        const favoriteSongs = storedFavorites ? JSON.parse(storedFavorites) : [];
  
        const updatedResults = fetchedSongs.map(song => {
          const existingFavorite = favoriteSongs.find(fav => fav.trackId === song.trackId);
          return {
            ...song,
            favorite: existingFavorite ? existingFavorite.favorite : false,
          };
        });
        setSongs(updatedResults);
      } catch (error) {
        console.error('Failed to fetch songs:', error);
      } finally {
        setLoading(false);
      }
    };

    getSongs();
  }, [count, maxId]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites !== null) {
          const parsedFavorites = JSON.parse(storedFavorites);
          const updatedResults = songs.map(song => ({
            ...song,
            favorite: parsedFavorites.some(fav => fav.trackId === song.trackId && fav.favorite),
          }));
          setSongs(updatedResults);
        }
      } catch (error) {
        console.error('Failed to load favorites', error);
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = async (trackId) => {
    const updatedSongs = songs.map(song => {
      if (song.trackId === trackId) {
        const updatedSong = { ...song, favorite: !song.favorite };
        saveFavorite(updatedSong);
        return updatedSong;
      }
      return song;
    });
    setSongs(updatedSongs);
  };

  const saveFavorite = async (song) => {
    try {
      let storedFavorites = await AsyncStorage.getItem('favorites');
      storedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      const existingIndex = storedFavorites.findIndex(fav => fav.trackId === song.trackId);
      if (existingIndex !== -1) {
        storedFavorites[existingIndex] = song;
      } else {
        storedFavorites.push(song);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(storedFavorites));
    } catch (error) {
      console.error('Failed to save favorite', error);
    }
  };

  const playSong = (previewUrl, title, artworkUrl) => {
    setSelectedSong({ previewUrl, title, artworkUrl });
  };

  const closeAudioPlayer = () => {
    setSelectedSong(null);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {selectedSong && (
        <View style={styles.audioPlayerContainer}>
          <AudioPlayer
            source={selectedSong.previewUrl}
            title={selectedSong.title}
            artworkUrl={selectedSong.artworkUrl}
            onClose={closeAudioPlayer}
          />
        </View>
      )}
      <FlatList
        data={songs}
        keyExtractor={(item, index) => item.trackId ? item.trackId.toString() : index.toString()}
        renderItem={({ item }) => (
          <View style={styles.songContainer}>
            <Image
              source={{ uri: item.artworkUrl100 || 'https://placehold.it/100x100' }}
              style={styles.artwork}
            />
            <View style={styles.songDetails}>
              <Text style={styles.songTitle}>{item.trackName}</Text>
              <Text style={styles.songArtist}>{item.artistName}</Text>
              <Text style={styles.songAlbum}>{item.collectionName}</Text>
              <Text style={styles.songGenre}>{item.primaryGenreName}</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => toggleFavorite(item.trackId)}>
                  <Ionicons
                    size={28}
                    style={styles.icon}
                    name={item.favorite ? 'heart' : 'heart-outline'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => playSong(item.previewUrl, item.trackName, item.artworkUrl100)}>
                  <Ionicons
                    size={28}
                    style={styles.playIcon}
                    name="play"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const generateUniqueRandomIds = (count, maxId) => {
  const uniqueIds = new Set();
  while (uniqueIds.size < count) {
    uniqueIds.add(Math.floor(Math.random() * maxId) + 1);
  }
  return Array.from(uniqueIds);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  audioPlayerContainer: {
    position: 'relative',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  songContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  songDetails: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  songArtist: {
    fontSize: 14,
    color: 'gray',
  },
  songAlbum: {
    fontSize: 14,
    color: 'gray',
  },
  songGenre: {
    fontSize: 14,
    color: 'gray',
  },
  iconContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  playIcon: {
    marginLeft: '80%',
  },
});

export default RandomSongs;
