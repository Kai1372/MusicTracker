import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import RandomAlbums from '../../../components/RandomAlbums';
import RandomSongs from '../../../components/RandomSongs';

const SongsScreen = () => {
  const sections = [
    { type: 'albums', title: 'Albums' },
    { type: 'songs', title: 'Something new to Listen to' },
  ];

  const renderSection = ({ item }) => {
    if (item.type === 'albums') {
      return <RandomAlbums count={50} maxId={2000000} />;
    } else if (item.type === 'songs') {
      return (
        <View style={styles.songSection}>
          <View style={styles.songSectionHeader}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
          </View>
          <RandomSongs count={150} maxId={2000000} />
        </View>
      );
    }
    return null;
  };

  return (
    <FlatList
      data={sections}
      renderItem={renderSection}
      keyExtractor={(item) => item.type}
      contentContainerStyle={styles.container}
      
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20,
  },
  songSection: {
    marginTop: 20,
  },
  songSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionLink: {
    fontSize: 20,
  },
});

export default SongsScreen;
