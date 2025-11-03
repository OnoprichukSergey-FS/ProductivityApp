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
  const [priority, setPriority] = useState<Priority>("low");
  const router = useRouter();

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a task title.");
      return;
    }

    try {
      await addTask(title, description, priority);
      Alert.alert("Success", "Task added successfully!");
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not save task.");
    }
  };

  return (
    <ScrollView
      style={isDark ? styles.containerDark : styles.containerLight}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={isDark ? styles.titleDark : styles.titleLight}>
        Add New Task
      </Text>

      <Text style={isDark ? styles.labelDark : styles.labelLight}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
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
  titleDark: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 16,
  },
  titleLight: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  labelDark: {
    color: "#e5e7eb",
    marginBottom: 4,
  },
  labelLight: {
    color: "#374151",
    marginBottom: 4,
  },
  inputDark: {
    backgroundColor: "#020617",
    color: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4b5563",
    marginBottom: 12,
  },
  inputLight: {
    backgroundColor: "#ffffff",
    color: "#111827",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9ca3af",
    marginBottom: 12,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  priorityRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  priorityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4b5563",
    backgroundColor: "#020617",
    marginRight: 8,
  },
  priorityChipActive: {
    backgroundColor: "#0ea5e9",
    borderColor: "#38bdf8",
  },
  priorityChipText: {
    fontSize: 13,
    color: "#cbd5f5",
  },
  priorityChipTextActive: {
    color: "#f9fafb",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 40,
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
