import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { addTask } from "../services/db";
import { useRouter } from "expo-router";
import { Priority } from "../types/task";
import { useAppTheme } from "./_layout";

const PRIORITY_OPTIONS: Priority[] = ["high", "medium", "low"];

export default function AddTaskScreen() {
  const { theme } = useAppTheme();
  const isDark = theme === "dark";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");

  const router = useRouter();

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a task title.");
      return;
    }

    try {
      await addTask(title.trim(), description.trim(), priority, dueDate.trim());

      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not save task.");
    }
  };

  return (
    <ScrollView
      style={isDark ? styles.containerDark : styles.containerLight}
      contentContainerStyle={styles.content}
    >
      <Text style={isDark ? styles.titleDark : styles.titleLight}>
        Add New Task
      </Text>

      <Text style={isDark ? styles.labelDark : styles.labelLight}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Example: Finish portfolio update"
        placeholderTextColor="#9ca3af"
        style={isDark ? styles.inputDark : styles.inputLight}
      />

      <Text style={isDark ? styles.labelDark : styles.labelLight}>
        Description
      </Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Optional details..."
        placeholderTextColor="#9ca3af"
        style={[
          isDark ? styles.inputDark : styles.inputLight,
          styles.multiline,
        ]}
        multiline
      />

      <Text style={isDark ? styles.labelDark : styles.labelLight}>
        Due Date
      </Text>
      <TextInput
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="Example: 2026-05-01"
        placeholderTextColor="#9ca3af"
        style={isDark ? styles.inputDark : styles.inputLight}
      />

      <Text style={isDark ? styles.labelDark : styles.labelLight}>
        Priority
      </Text>

      <View style={styles.priorityRow}>
        {PRIORITY_OPTIONS.map((p) => {
          const active = p === priority;

          return (
            <TouchableOpacity
              key={p}
              onPress={() => setPriority(p)}
              style={[styles.priorityChip, active && styles.priorityChipActive]}
            >
              <Text
                style={[
                  styles.priorityChipText,
                  active && styles.priorityChipTextActive,
                ]}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerDark: {
    flex: 1,
    backgroundColor: "#020617",
  },
  containerLight: {
    flex: 1,
    backgroundColor: "#e5e7eb",
  },
  content: {
    padding: 20,
  },
  titleDark: {
    fontSize: 26,
    fontWeight: "900",
    color: "#f9fafb",
    marginBottom: 22,
  },
  titleLight: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 22,
  },
  labelDark: {
    color: "#e5e7eb",
    marginBottom: 6,
    fontWeight: "700",
  },
  labelLight: {
    color: "#374151",
    marginBottom: 6,
    fontWeight: "700",
  },
  inputDark: {
    backgroundColor: "#0f172a",
    color: "#f9fafb",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
    fontSize: 16,
  },
  inputLight: {
    backgroundColor: "#ffffff",
    color: "#111827",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    marginBottom: 16,
    fontSize: 16,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  priorityRow: {
    flexDirection: "row",
    marginBottom: 28,
    gap: 8,
  },
  priorityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#475569",
    backgroundColor: "#020617",
  },
  priorityChipActive: {
    backgroundColor: "#0ea5e9",
    borderColor: "#38bdf8",
  },
  priorityChipText: {
    fontSize: 13,
    color: "#cbd5e1",
    fontWeight: "700",
  },
  priorityChipTextActive: {
    color: "#ffffff",
    fontWeight: "900",
  },
  saveButton: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 40,
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 16,
  },
});
