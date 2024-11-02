import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchAlbumsByIds } from './iTunesService';

const RandomAlbums = ({ count, maxId }) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAlbums = async () => {
      try {
        const albumIds = generateUniqueRandomIds(count, maxId);
        const fetchedAlbums = await fetchAlbumsByIds(albumIds);
        setAlbums(fetchedAlbums);
      } catch (error) {
        console.error('Failed to fetch albums:', error);
      } finally {
        setLoading(false);
      }
    };

    getAlbums();
  }, [count, maxId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
      {albums.map((album) => (
        <View key={album.collectionId} style={styles.albumContainer}>
          <Image source={{ uri: album.artworkUrl100 }} style={styles.albumArt} />
          <Text style={styles.albumTitle} numberOfLines={1} ellipsizeMode="tail">
            {album.collectionName}
          </Text>
          <Text style={styles.artistName} numberOfLines={1} ellipsizeMode="tail">
            {album.artistName}
          </Text>
          
        </View>
      ))}
    </ScrollView>
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
  scrollView: {
    paddingVertical: 10,
  },
  albumContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    width: 120, 
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
    maxWidth: '100%',
  },
  artistName: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: '100%', 
  },
  duration: {
    fontSize: 12,
    textAlign: 'center',
    color: 'gray',
  },
});

export default RandomAlbums;
