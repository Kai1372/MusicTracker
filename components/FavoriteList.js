import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioPlayer from './AudioPlayer'; 

const FavoriteList = () => {
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [undoItem, setUndoItem] = useState(null);
  const [noFavoritesFound, setNoFavoritesFound] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites !== null) {
        const parsedFavorites = JSON.parse(storedFavorites);
        const filteredFavorites = parsedFavorites.filter(song => song.favorite);
        setFavoriteSongs(filteredFavorites);
        setNoFavoritesFound(filteredFavorites.length === 0);
      } else {
        setFavoriteSongs([]);
        setNoFavoritesFound(true);
      }
    } catch (error) {
      console.error('Failed to load favorites', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(loadFavorites, 1000); 
    return () => clearInterval(interval); 
  }, []);

  const toggleFavorite = async (trackId) => {
    try {
      let storedFavorites = await AsyncStorage.getItem('favorites');
      storedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      const updatedFavorites = storedFavorites.map(song => {
        if (song.trackId === trackId) {
          const updatedSong = { ...song, favorite: !song.favorite };
          if (!updatedSong.favorite) {
            setModalVisible(true); 
            setUndoItem(updatedSong); 
          }
          return updatedSong;
        }
        return song;
      });

      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      loadFavorites(); 
    } catch (error) {
      console.error('Failed to toggle favorite', error);
    }
  };

  const undoUnfavorite = async () => {
    if (undoItem) {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        let parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];

        parsedFavorites = parsedFavorites.map(song => {
          if (song.trackId === undoItem.trackId) {
            return { ...song, favorite: true };
          }
          return song;
        });

        await AsyncStorage.setItem('favorites', JSON.stringify(parsedFavorites));
        loadFavorites(); 
        setModalVisible(false);
        setUndoItem(null);
      } catch (error) {
        console.error('Failed to undo unfavoriting', error);
      }
    }
  };

  const playSong = (previewUrl, title, artworkUrl) => {
    setSelectedSong({ previewUrl, title, artworkUrl });
  };

  const closeAudioPlayer = () => {
    setSelectedSong(null);
  };

  const renderSongItem = ({ item }) => (
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
              name={item.favorite ? 'heart' : 'heart-outline'}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => playSong(item.previewUrl, item.trackName, item.artworkUrl100)}>
            <Ionicons
              size={28}
              name="play"
              style={styles.playIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {noFavoritesFound && (
        <Text style={styles.noFavoritesText}>You have no favorited songs. Go into songs to find songs you like!</Text>
      )}
      <FlatList
        data={favoriteSongs}
        keyExtractor={(item) => item.trackId.toString()}
        renderItem={renderSongItem}
      />
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons
                size={28}
                style={styles.closeIcon}
                name="close"
              />
            </TouchableOpacity>
            <Text style={styles.modalText}>Song removed from favorites</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={undoUnfavorite}
            >
              <Text style={styles.textStyle}>Undo</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  favoritedIcon: {
    marginRight: 10,
    color: 'red',
  },
  unfavoritedIcon: {
    marginRight: 10,
  },
  playIcon: {
    marginLeft: '82.5%',
  },
  iconContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  closeIcon: {
    marginLeft: '85%',
    marginTop: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    width: '75%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  noFavoritesText: {
    textAlign: 'center',
    alignItems: 'center',
    fontSize: 16,
    borderBottomWidth: 1,
    color: '#555',
    marginTop: '75%',
    borderBottomColor: '#bbb',
  },
});

export default FavoriteList;
