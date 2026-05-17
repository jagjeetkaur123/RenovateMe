import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1d4ed8",
        tabBarInactiveTintColor: "#9ca3af",
        headerStyle: { backgroundColor: "#1e3a8a" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="trades"
        options={{
          title: "Find Tradies",
          tabBarLabel: "Trades",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🔧</Text>,
        }}
      />
      <Tabs.Screen
        name="hire"
        options={{
          title: "Hire Now",
          tabBarLabel: "Hire",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚡</Text>,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: "Book",
          tabBarLabel: "Book",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📅</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
