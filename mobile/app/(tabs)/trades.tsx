import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

const CATEGORIES = [
  { id: "handyman", label: "General / Handyman", icon: "🔧" },
  { id: "plumbing", label: "Plumbing", icon: "🚿" },
  { id: "electrical", label: "Electrical", icon: "🔌" },
  { id: "renovation", label: "Renovation & Construction", icon: "🧱" },
  { id: "carpentry", label: "Carpentry", icon: "🪚" },
  { id: "cleaning", label: "Cleaning", icon: "🧼" },
  { id: "painting", label: "Painting & Decorating", icon: "🎨" },
  { id: "landscaping", label: "Landscaping & Gardening", icon: "🌿" },
  { id: "tiling_flooring", label: "Tiling & Flooring", icon: "🧱" },
  { id: "security", label: "Security Services", icon: "🔐" },
  { id: "moving_transport", label: "Moving & Transport", icon: "🚛" },
  { id: "heating_cooling", label: "Heating, Cooling & Appliances", icon: "❄️" },
  { id: "specialist", label: "Specialist Trades", icon: "🧰" },
];

export default function TradesScreen() {
  const [search, setSearch] = useState("");

  const filtered = CATEGORIES.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search trade type..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#9ca3af"
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.catRow}
            onPress={() => router.push({ pathname: "/trades/[category]", params: { category: item.id } } as never)}
          >
            <Text style={styles.catIcon}>{item.icon}</Text>
            <Text style={styles.catLabel}>{item.label}</Text>
            <Text style={{ color: "#9ca3af" }}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  searchInput: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    color: "#111827",
  },
  catRow: {
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
  catIcon: { fontSize: 24 },
  catLabel: { flex: 1, fontSize: 15, color: "#111827", fontWeight: "500" },
});
