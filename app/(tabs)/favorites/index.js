import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import FavoriteList from '../../../components/FavoriteList';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
         
          <FavoriteList />
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
    
