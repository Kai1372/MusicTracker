import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchAlbums } from './iTunesService'; 

const AlbumFetcher = ({ searchTerm }) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAlbums = async () => {
      try {
        const fetchedAlbums = await fetchAlbums(searchTerm);
        setAlbums(fetchedAlbums);
      } catch (error) {
        console.error('Failed to fetch albums:', error);
      } finally {
        setLoading(false);
      }
    };

    getAlbums();
  }, [searchTerm]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView horizontal style={styles.scrollView}>
      {albums.map((album) => (
        <View key={album.collectionId} style={styles.albumContainer}>
          <Image source={{ uri: album.artworkUrl100 }} style={styles.albumArt} />
          <Text style={styles.albumTitle}>{album.collectionName}</Text>
          <Text style={styles.artistName}>{album.artistName}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
  },
  albumContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  albumArt: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  albumTitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artistName: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AlbumFetcher;
