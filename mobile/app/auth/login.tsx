import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import api, { storeTokens } from "@/lib/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      await storeTokens(data.access_token, data.refresh_token);

      const roleRoutes: Record<string, string> = {
        customer: "/(tabs)/",
        tradesperson: "/(tabs)/",
        business_owner: "/(tabs)/",
        admin: "/(tabs)/",
      };
      router.replace((roleRoutes[data.user.role] ?? "/(tabs)/") as never);
    } catch {
      Alert.alert("Login Failed", "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SilverBricks Connect</Text>
      <Text style={styles.title}>Welcome back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#9ca3af"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#9ca3af"
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Signing in..." : "Sign in"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/register" as never)}>
        <Text style={styles.link}>Don&apos;t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#f9fafb",
    padding: 24, justifyContent: "center",
  },
  logo: { fontSize: 22, fontWeight: "bold", color: "#1d4ed8", textAlign: "center", marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "bold", color: "#111827", textAlign: "center", marginBottom: 32 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10, borderWidth: 1, borderColor: "#e5e7eb",
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: "#111827", marginBottom: 12,
  },
  btn: {
    backgroundColor: "#1d4ed8", borderRadius: 10,
    padding: 14, alignItems: "center", marginTop: 8,
  },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { color: "#1d4ed8", textAlign: "center", marginTop: 20, fontSize: 14 },
});
