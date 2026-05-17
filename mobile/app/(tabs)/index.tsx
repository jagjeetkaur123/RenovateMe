import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";

const modules = [
  { title: "Find a Tradie", icon: "🔧", desc: "Browse verified tradespeople", route: "/(tabs)/trades" },
  { title: "Hire Now ⚡", icon: "⚡", desc: "Instant on-demand hiring", route: "/(tabs)/hire" },
  { title: "Book Appointment", icon: "📅", desc: "Salons, clinics & venues", route: "/(tabs)/book" },
];

const categories = [
  { label: "Plumbing", icon: "🚿" },
  { label: "Electrical", icon: "🔌" },
  { label: "Cleaning", icon: "🧼" },
  { label: "Landscaping", icon: "🌿" },
  { label: "Painting", icon: "🎨" },
  { label: "Beauty", icon: "💅" },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>SilverBricks Connect</Text>
        <Text style={styles.heroSubtitle}>Australia&apos;s Services Marketplace</Text>
      </View>

      {/* Modules */}
      <Text style={styles.sectionTitle}>What do you need?</Text>
      {modules.map((m) => (
        <TouchableOpacity
          key={m.title}
          style={styles.card}
          onPress={() => router.push(m.route as never)}
        >
          <Text style={styles.cardIcon}>{m.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{m.title}</Text>
            <Text style={styles.cardDesc}>{m.desc}</Text>
          </View>
          <Text style={{ color: "#9ca3af" }}>›</Text>
        </TouchableOpacity>
      ))}

      {/* Quick categories */}
      <Text style={styles.sectionTitle}>Popular Categories</Text>
      <View style={styles.grid}>
        {categories.map((c) => (
          <TouchableOpacity key={c.label} style={styles.catCard}>
            <Text style={styles.catIcon}>{c.icon}</Text>
            <Text style={styles.catLabel}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Post job CTA */}
      <TouchableOpacity style={styles.ctaButton} onPress={() => router.push("/jobs/new" as never)}>
        <Text style={styles.ctaText}>📋 Post a Job</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 40 },
  hero: {
    backgroundColor: "#1e3a8a",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
  },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  heroSubtitle: { color: "#bfdbfe", fontSize: 14, marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: "600", color: "#111827", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: { fontSize: 28 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  cardDesc: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  catCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    width: "30%",
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  catIcon: { fontSize: 26 },
  catLabel: { fontSize: 12, color: "#374151", fontWeight: "500" },
  ctaButton: {
    backgroundColor: "#1d4ed8",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
