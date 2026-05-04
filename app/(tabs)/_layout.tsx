import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0D9488",
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          paddingTop: 8, // Added from HEAD
          paddingBottom: 8,
          height: 84,
        },
        tabBarActiveTintColor: '#0D9488',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      {/* Home / News & Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home", // Assuming a default title for the index screen
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Telemedicine */}
      <Tabs.Screen
        name="Telemedicine"
        options={{
          title: 'Telemed',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="videocam-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Queue */}
      <Tabs.Screen
        name="queue"
        options={{
          title: "Pila",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          title: 'Queue',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Hidden but routable */}
      <Tabs.Screen
        name="programs"
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
