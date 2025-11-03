import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import TaskItem from "../components/TaskItem";
import { Task } from "../types/task";
import { getTasks, toggleTaskCompleted, deleteTask } from "../services/db";
import { useAppTheme } from "./_layout";

type Filter = "all" | "active" | "completed";

export default function TaskListScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  const router = useRouter();
  const { theme } = useAppTheme();
  const isDark = theme === "dark";

  const loadTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (e) {
      console.error("Error loading tasks", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const handleToggle = async (task: Task) => {
    await toggleTaskCompleted(task.id, !task.completed);
    loadTasks();
  };

  const handleDelete = async (task: Task) => {
    await deleteTask(task.id);
    loadTasks();
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;

  const bgStyle = isDark ? styles.containerDark : styles.containerLight;
  const headerTextStyle = isDark
    ? styles.headerTextDark
    : styles.headerTextLight;
  const subTextStyle = isDark ? styles.subTextDark : styles.subTextLight;

  return (
    <View style={bgStyle}>
      {/* Top buttons */}
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => router.push("/add-task")}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings")}
          style={styles.settingsButton}
        >
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Header + stats */}
      <View style={styles.headerBlock}>
        <Text style={headerTextStyle}>Productivity Tasks</Text>
        <Text style={subTextStyle}>
          Total: {total} • Completed: {completed}
        </Text>
      </View>

      {/* Filter buttons */}
      <View style={styles.filterRow}>
        <FilterChip
          label="All"
          active={filter === "all"}
          onPress={() => setFilter("all")}
        />
        <FilterChip
          label="Active"
          active={filter === "active"}
          onPress={() => setFilter("active")}
        />
        <FilterChip
          label="Completed"
          active={filter === "completed"}
          onPress={() => setFilter("completed")}
        />
      </View>

      {/* Task list */}
      {loading && total === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={subTextStyle}>Loading tasks...</Text>
        </View>
      ) : filteredTasks.length === 0 ? (
        <View style={styles.center}>
          <Text style={subTextStyle}>No tasks yet. We’ll add some next.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={() => handleToggle(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadTasks();
              }}
            />
          }
        />
      )}
    </View>
  );
}

type FilterChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.filterChip, active && styles.filterChipActive]}
    >
      <Text
        style={[styles.filterChipText, active && styles.filterChipTextActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerDark: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: "#020617",
  },
  containerLight: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: "#e5e7eb",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#0ea5e9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#f9fafb",
    fontWeight: "600",
    fontSize: 14,
  },
  settingsButton: {
    backgroundColor: "#020617",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  settingsButtonText: {
    color: "#e5e7eb",
    fontSize: 14,
  },
  headerBlock: {
    marginBottom: 12,
  },
  headerTextDark: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f9fafb",
  },
  headerTextLight: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  subTextDark: {
    fontSize: 13,
    color: "#9ca3af",
  },
  subTextLight: {
    fontSize: 13,
    color: "#4b5563",
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4b5563",
    backgroundColor: "#020617",
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#0ea5e9",
    borderColor: "#38bdf8",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#cbd5f5",
  },
  filterChipTextActive: {
    color: "#f9fafb",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
