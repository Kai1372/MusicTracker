import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="favorites/index"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} style={{ marginBottom: -3 }} name="heart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} style={{ marginBottom: -3 }} name="home-sharp" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="songs/index"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} style={{ marginBottom: -3 }} name="search" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
