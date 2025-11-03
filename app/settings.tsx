import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
} from "react-native";
import { useAppTheme } from "./_layout";
import { loadName, saveName } from "../services/settings";

export default function SettingsScreen() {
  const { theme, toggleTheme } = useAppTheme();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    (async () => {
      const stored = await loadName();
      if (stored) setName(stored);
    })();
  }, []);

  const handleSaveName = async () => {
    setSaving(true);
    try {
      await saveName(name);
      Alert.alert("Saved", "Your name has been updated.");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not save your name.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={isDark ? styles.containerDark : styles.containerLight}>
      <Text style={isDark ? styles.titleDark : styles.titleLight}>
        Settings
      </Text>

      <Text style={isDark ? styles.labelDark : styles.labelLight}>
        Your name
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Type your name"
        placeholderTextColor="#9ca3af"
        style={isDark ? styles.inputDark : styles.inputLight}
      />

      <TouchableOpacity
        onPress={handleSaveName}
        disabled={saving}
        style={saving ? styles.saveButtonDisabled : styles.saveButton}
      >
        <Text style={styles.saveButtonText}>
          {saving ? "Saving..." : "Save Name"}
        </Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={isDark ? styles.titleDark : styles.titleLight}>
            Dark mode
          </Text>
          <Text style={isDark ? styles.labelDark : styles.labelLight}>
            Applies to all screens and is saved securely.
          </Text>
        </View>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerDark: {
    flex: 1,
    padding: 20,
    backgroundColor: "#020617",
  },
  containerLight: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e5e7eb",
  },
  titleDark: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 24,
  },
  titleLight: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
  },
  labelDark: {
    color: "#e5e7eb",
    marginBottom: 6,
  },
  labelLight: {
    color: "#374151",
    marginBottom: 6,
  },
  inputDark: {
    backgroundColor: "#020617",
    color: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  inputLight: {
    backgroundColor: "#ffffff",
    color: "#111827",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#9ca3af",
  },
  saveButton: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  saveButtonDisabled: {
    backgroundColor: "#4b5563",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#4b5563",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
