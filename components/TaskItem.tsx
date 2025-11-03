import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Task, Priority } from "../types/task";
import { useAppTheme } from "../app/_layout";

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

function priorityLabel(p: Priority) {
  if (p === "high") return "High";
  if (p === "medium") return "Medium";
  return "Low";
}

function priorityColor(p: Priority) {
  switch (p) {
    case "high":
      return "#f97316";
    case "medium":
      return "#22c55e";
    case "low":
    default:
      return "#38bdf8";
  }
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const { theme } = useAppTheme();
  const isDark = theme === "dark";

  const containerStyle = [
    styles.container,
    isDark ? styles.containerDark : styles.containerLight,
    task.completed && styles.containerCompleted,
  ];

  const titleStyle = [
    styles.title,
    isDark ? styles.titleDark : styles.titleLight,
    task.completed && styles.titleCompleted,
  ];

  const descStyle = [
    styles.description,
    isDark ? styles.descDark : styles.descLight,
  ];

  const statusStyle = [
    styles.statusText,
    isDark ? styles.statusDark : styles.statusLight,
  ];

  const badgeStyle = [
    styles.priorityBadge,
    {
      borderColor: priorityColor(task.priority),
      backgroundColor: isDark ? "#020617" : "#e5e7eb",
    },
  ];

  function handleDelete() {
    Alert.alert("Delete task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onDelete },
    ]);
  }

  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={onToggle} style={styles.content}>
        <Text style={titleStyle}>{task.title}</Text>
        {task.description ? (
          <Text style={descStyle} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={badgeStyle}>
            <Text style={styles.priorityText}>
              {priorityLabel(task.priority)}
            </Text>
          </View>

          <Text style={statusStyle}>
            {task.completed ? "Completed" : "Active"}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  containerDark: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  containerLight: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  containerCompleted: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  titleDark: {
    color: "#f9fafb",
  },
  titleLight: {
    color: "#111827",
  },
  titleCompleted: {
    textDecorationLine: "line-through",
  },
  description: {
    fontSize: 13,
    marginBottom: 8,
  },
  descDark: {
    color: "#9ca3af",
  },
  descLight: {
    color: "#4b5563",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f9fafb",
  },
  statusText: {
    fontSize: 12,
  },
  statusDark: {
    color: "#9ca3af",
  },
  statusLight: {
    color: "#4b5563",
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "center",
  },
  deleteText: {
    fontSize: 12,
    color: "#f97373",
    fontWeight: "600",
  },
});
