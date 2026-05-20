import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import api from "@/lib/api";

const CATEGORIES = [
  { id: "handyman", label: "Handyman" },
  { id: "plumbing", label: "Plumbing" },
  { id: "electrical", label: "Electrical" },
  { id: "renovation", label: "Renovation" },
  { id: "carpentry", label: "Carpentry" },
  { id: "cleaning", label: "Cleaning" },
  { id: "painting", label: "Painting" },
  { id: "landscaping", label: "Landscaping" },
  { id: "tiling_flooring", label: "Tiling & Flooring" },
  { id: "security", label: "Security" },
  { id: "moving_transport", label: "Moving" },
  { id: "heating_cooling", label: "Heating & Cooling" },
  { id: "specialist", label: "Specialist" },
];

const URGENCY = [
  { value: "standard", label: "Standard" },
  { value: "urgent", label: "Urgent (48hrs)" },
  { value: "emergency", label: "Emergency (ASAP)" },
];

export default function NewJobScreen() {
  const [form, setForm] = useState({
    title: "", description: "", category: "", suburb: "",
    budget_min: "", budget_max: "", urgency: "standard",
  });
  const [loading, setLoading] = useState(false);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.title || !form.description || !form.category || !form.suburb) {
      Alert.alert("Missing fields", "Please fill in title, description, category, and suburb.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/jobs", {
        title: form.title,
        description: form.description,
        category: form.category,
        suburb: form.suburb,
        budget_min: form.budget_min ? parseFloat(form.budget_min) : null,
        budget_max: form.budget_max ? parseFloat(form.budget_max) : null,
        urgency: form.urgency,
      });
      Alert.alert("Job Posted!", "Your job has been posted. Tradies will send you quotes soon.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/" as never) },
      ]);
    } catch (err: any) {
      const msg = err.response?.data?.detail ?? "Failed to post job. Make sure you are logged in.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Post a Job</Text>
      <Text style={styles.subheading}>Describe what you need and receive quotes from verified tradies.</Text>

      <Text style={styles.label}>Job title *</Text>
      <TextInput style={styles.input} placeholder="e.g. Fix leaking bathroom tap" value={form.title} onChangeText={(v) => set("title", v)} placeholderTextColor="#9ca3af" />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Describe the job in detail..."
        value={form.description}
        onChangeText={(v) => set("description", v)}
        multiline
        numberOfLines={4}
        placeholderTextColor="#9ca3af"
        textAlignVertical="top"
      />

      <Text style={styles.label}>Trade category *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
        <View style={{ flexDirection: "row", gap: 8, paddingVertical: 4 }}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, form.category === c.id && styles.chipActive]}
              onPress={() => set("category", c.id)}
            >
              <Text style={[styles.chipText, form.category === c.id && styles.chipTextActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Text style={styles.label}>Suburb *</Text>
      <TextInput style={styles.input} placeholder="e.g. Fitzroy" value={form.suburb} onChangeText={(v) => set("suburb", v)} placeholderTextColor="#9ca3af" />

      <Text style={styles.label}>Budget range (AUD)</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Min $" value={form.budget_min} onChangeText={(v) => set("budget_min", v)} keyboardType="numeric" placeholderTextColor="#9ca3af" />
        <Text style={{ alignSelf: "center", color: "#9ca3af", marginHorizontal: 8 }}>–</Text>
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Max $" value={form.budget_max} onChangeText={(v) => set("budget_max", v)} keyboardType="numeric" placeholderTextColor="#9ca3af" />
      </View>

      <Text style={styles.label}>Urgency</Text>
      <View style={styles.urgencyRow}>
        {URGENCY.map((u) => (
          <TouchableOpacity
            key={u.value}
            style={[styles.urgencyBtn, form.urgency === u.value && styles.urgencyBtnActive]}
            onPress={() => set("urgency", u.value)}
          >
            <Text style={[styles.urgencyText, form.urgency === u.value && styles.urgencyTextActive]}>{u.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitText}>{loading ? "Posting..." : "Post Job"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 48 },
  heading: { fontSize: 22, fontWeight: "bold", color: "#111827", marginBottom: 4 },
  subheading: { fontSize: 14, color: "#6b7280", marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginTop: 14, marginBottom: 6 },
  input: { backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#e5e7eb", paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#111827" },
  textarea: { height: 100 },
  row: { flexDirection: "row", alignItems: "center" },
  chip: { borderRadius: 20, borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { borderColor: "#1d4ed8", backgroundColor: "#eff6ff" },
  chipText: { fontSize: 13, color: "#6b7280", fontWeight: "500" },
  chipTextActive: { color: "#1d4ed8" },
  urgencyRow: { flexDirection: "row", gap: 8 },
  urgencyBtn: { flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#fff", padding: 10, alignItems: "center" },
  urgencyBtnActive: { borderColor: "#1d4ed8", backgroundColor: "#eff6ff" },
  urgencyText: { fontSize: 12, color: "#6b7280", fontWeight: "500", textAlign: "center" },
  urgencyTextActive: { color: "#1d4ed8" },
  submitBtn: { backgroundColor: "#1d4ed8", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 24 },
  submitText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
