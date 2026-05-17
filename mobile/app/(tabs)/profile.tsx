import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { clearTokens } from "@/lib/api";

export default function ProfileScreen() {
  async function handleLogout() {
    await clearTokens();
    router.replace("/auth/login" as never);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar placeholder */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.name}>My Account</Text>
      </View>

      {/* Menu items */}
      {[
        { label: "My Bookings", icon: "🗓️", route: "/bookings" },
        { label: "My Jobs", icon: "📋", route: "/jobs" },
        { label: "Edit Profile", icon: "✏️", route: "/profile/edit" },
        { label: "Notifications", icon: "🔔", route: "/notifications" },
        { label: "Help & Support", icon: "❓", route: "/support" },
      ].map((item) => (
        <TouchableOpacity
          key={item.label}
          style={styles.menuItem}
          onPress={() => router.push(item.route as never)}
        >
          <Text style={styles.menuIcon}>{item.icon}</Text>
          <Text style={styles.menuLabel}>{item.label}</Text>
          <Text style={{ color: "#9ca3af" }}>›</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 40 },
  avatarContainer: { alignItems: "center", marginBottom: 24, marginTop: 8 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 36 },
  name: { fontSize: 18, fontWeight: "600", color: "#111827", marginTop: 8 },
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  menuIcon: { fontSize: 20 },
  menuLabel: { flex: 1, fontSize: 15, color: "#111827" },
  logoutButton: {
    marginTop: 16,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fee2e2",
    backgroundColor: "#fff5f5",
  },
  logoutText: { color: "#dc2626", fontWeight: "600", fontSize: 15 },
});
