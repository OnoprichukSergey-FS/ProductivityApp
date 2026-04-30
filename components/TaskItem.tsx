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
  if (p === "high") return "#f97316";
  if (p === "medium") return "#eab308";
  return "#38bdf8";
}

function formatDueDate(date: string) {
  if (!date) return "No due date";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const { theme } = useAppTheme();
  const isDark = theme === "dark";

  function handleDelete() {
    Alert.alert("Delete task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onDelete },
    ]);
  }

  return (
    <View
      style={[
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
        task.completed && styles.cardCompleted,
      ]}
    >
      <TouchableOpacity onPress={onToggle} style={styles.checkboxWrap}>
        <View
          style={[styles.checkbox, task.completed && styles.checkboxChecked]}
        >
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onToggle} style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              isDark ? styles.titleDark : styles.titleLight,
              task.completed && styles.titleCompleted,
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>

          <View
            style={[
              styles.priorityBadge,
              { borderColor: priorityColor(task.priority) },
            ]}
          >
            <Text
              style={[
                styles.priorityText,
                { color: priorityColor(task.priority) },
              ]}
            >
              {priorityLabel(task.priority)}
            </Text>
          </View>
        </View>

        {task.description ? (
          <Text
            style={[
              styles.description,
              isDark ? styles.descDark : styles.descLight,
            ]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <Text style={isDark ? styles.metaDark : styles.metaLight}>
            Due: {formatDueDate(task.dueDate)}
          </Text>

          <Text style={isDark ? styles.metaDark : styles.metaLight}>
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
  card: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
  },
  cardDark: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
  },
  cardLight: {
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
  },
  cardCompleted: {
    opacity: 0.65,
  },
  checkboxWrap: {
    paddingTop: 2,
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#475569",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#0ea5e9",
    borderColor: "#38bdf8",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
  },
  titleDark: {
    color: "#f8fafc",
  },
  titleLight: {
    color: "#111827",
  },
  titleCompleted: {
    textDecorationLine: "line-through",
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  descDark: {
    color: "#94a3b8",
  },
  descLight: {
    color: "#4b5563",
  },
  priorityBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "800",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  metaDark: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },
  metaLight: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    marginLeft: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 12,
    color: "#fb7185",
    fontWeight: "800",
  },
});
