import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, Image, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchSongs } from './iTunesService';
import AudioPlayer from './AudioPlayer'; 

const SongList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState([]);
  const [noItemsFound, setNoItemsFound] = useState('');
  const [selectedSong, setSelectedSong] = useState(null); 

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

  const searchSongs = async () => {
    try {
      const searchValue = JSON.stringify(searchTerm);
      const results = await fetchSongs(searchValue);
      if (results.length === 0) {
        setNoItemsFound('Unable to find any songs. Please try and search again');
      } else {
        setNoItemsFound('');
      }

      const storedFavorites = await AsyncStorage.getItem('favorites');
      const favoriteSongs = storedFavorites ? JSON.parse(storedFavorites) : [];

      const updatedResults = results.map(song => {
        const existingFavorite = favoriteSongs.find(fav => fav.trackId === song.trackId);
        return {
          ...song,
          favorite: existingFavorite ? existingFavorite.favorite : false,
        };
      });
      console.log(favoriteSongs)
      setSongs(updatedResults);
      Keyboard.dismiss();
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity style={styles.button} onPress={searchSongs}>
          <Ionicons
            size={28}
            style={styles.icon}
            name="search"
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Search for a song"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>
      <Text>{noItemsFound}</Text>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.trackId.toString()}
        renderItem={({ item }) => (
          <View style={styles.songContainer}>
            <Image source={{ uri: item.artworkUrl100 }} style={styles.artwork} />
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
      {selectedSong && (
        <AudioPlayer
          source={selectedSong.previewUrl}
          title={selectedSong.title}
          artworkUrl={selectedSong.artworkUrl}
          onClose={closeAudioPlayer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40, 
    marginBottom: 16,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  input: {
    height: '100%', 
    borderColor: 'gray',
    paddingHorizontal: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40, 
    height: 40, 
  },
  playIcon: {
    marginLeft: '82.5%',
  },
  playIcon: {
    marginLeft: '82.5%',
  },
});

export default SongList;
