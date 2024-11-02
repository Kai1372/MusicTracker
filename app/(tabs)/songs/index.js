import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import SongList from '../../../components/SongList';

export default function SongsScreen() {
  return (
    <View style={styles.container}>
      <SongList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});
