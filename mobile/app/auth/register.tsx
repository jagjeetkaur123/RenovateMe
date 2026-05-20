import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import api, { storeTokens } from "@/lib/api";

const ROLES = [
  { value: "customer", label: "I need services" },
  { value: "tradesperson", label: "I'm a tradesperson" },
  { value: "business_owner", label: "I run a business" },
];

export default function RegisterScreen() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "customer" });
  const [loading, setLoading] = useState(false);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleRegister() {
    if (!form.name || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    if (form.password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        role: form.role,
      });
      await storeTokens(data.access_token, data.refresh_token);
      router.replace("/(tabs)/" as never);
    } catch (err: any) {
      const msg = err.response?.data?.detail ?? "Registration failed. Please try again.";
      Alert.alert("Registration Failed", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.logo}>SilverBricks Connect</Text>
      <Text style={styles.title}>Create your account</Text>

      {/* Role selection */}
      <Text style={styles.label}>I am...</Text>
      <View style={styles.roleRow}>
        {ROLES.map((r) => (
          <TouchableOpacity
            key={r.value}
            style={[styles.roleBtn, form.role === r.value && styles.roleBtnActive]}
            onPress={() => set("role", r.value)}
          >
            <Text style={[styles.roleBtnText, form.role === r.value && styles.roleBtnTextActive]}>
              {r.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Full name *</Text>
      <TextInput style={styles.input} placeholder="Jane Smith" value={form.name} onChangeText={(v) => set("name", v)} autoCapitalize="words" placeholderTextColor="#9ca3af" />

      <Text style={styles.label}>Email address *</Text>
      <TextInput style={styles.input} placeholder="jane@example.com" value={form.email} onChangeText={(v) => set("email", v)} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#9ca3af" />

      <Text style={styles.label}>Password *</Text>
      <TextInput style={styles.input} placeholder="At least 8 characters" value={form.password} onChangeText={(v) => set("password", v)} secureTextEntry placeholderTextColor="#9ca3af" />

      <Text style={styles.label}>Phone (optional)</Text>
      <TextInput style={styles.input} placeholder="04xx xxx xxx" value={form.phone} onChangeText={(v) => set("phone", v)} keyboardType="phone-pad" placeholderTextColor="#9ca3af" />

      <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Creating account..." : "Create Account"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 24, paddingBottom: 48 },
  logo: { fontSize: 20, fontWeight: "bold", color: "#1d4ed8", textAlign: "center", marginBottom: 4 },
  title: { fontSize: 22, fontWeight: "bold", color: "#111827", textAlign: "center", marginBottom: 24 },
  label: { fontSize: 13, fontWeight: "500", color: "#374151", marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#e5e7eb",
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#111827",
  },
  roleRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  roleBtn: {
    flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#e5e7eb",
    backgroundColor: "#fff", padding: 10, alignItems: "center",
  },
  roleBtnActive: { borderColor: "#1d4ed8", backgroundColor: "#eff6ff" },
  roleBtnText: { fontSize: 12, color: "#6b7280", fontWeight: "500", textAlign: "center" },
  roleBtnTextActive: { color: "#1d4ed8" },
  btn: { backgroundColor: "#1d4ed8", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 24 },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { color: "#1d4ed8", textAlign: "center", marginTop: 16, fontSize: 14 },
});
