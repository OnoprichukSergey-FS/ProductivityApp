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
  const active = total - completed;
  const completionRate =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const bgStyle = isDark ? styles.containerDark : styles.containerLight;
  const titleStyle = isDark ? styles.titleDark : styles.titleLight;
  const textStyle = isDark ? styles.textDark : styles.textLight;
  const cardStyle = isDark ? styles.summaryCardDark : styles.summaryCardLight;

  return (
    <View style={bgStyle}>
      <View style={styles.hero}>
        <View>
          <Text style={styles.kicker}>Productivity System</Text>
          <Text style={titleStyle}>Today’s Tasks</Text>
          <Text style={textStyle}>
            {active} active • {completed} completed
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/settings")}
          style={styles.settingsButton}
        >
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryGrid}>
        <View style={[styles.summaryCard, cardStyle]}>
          <Text style={styles.summaryNumber}>{total}</Text>
          <Text style={textStyle}>Total</Text>
        </View>

        <View style={[styles.summaryCard, cardStyle]}>
          <Text style={styles.summaryNumber}>{active}</Text>
          <Text style={textStyle}>Active</Text>
        </View>

        <View style={[styles.summaryCard, cardStyle]}>
          <Text style={styles.summaryNumber}>{completionRate}%</Text>
          <Text style={textStyle}>Done</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => router.push("/add-task")}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>

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

      {loading && total === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={textStyle}>Loading tasks...</Text>
        </View>
      ) : filteredTasks.length === 0 ? (
        <View style={styles.center}>
          <Text style={[textStyle, styles.emptyText]}>
            No tasks here yet. Add one to start building momentum.
          </Text>
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
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
  hero: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },
  kicker: {
    color: "#0ea5e9",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  titleDark: {
    fontSize: 30,
    fontWeight: "900",
    color: "#f8fafc",
  },
  titleLight: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111827",
  },
  textDark: {
    fontSize: 13,
    color: "#94a3b8",
  },
  textLight: {
    fontSize: 13,
    color: "#4b5563",
  },
  settingsButton: {
    backgroundColor: "#020617",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#334155",
  },
  settingsButtonText: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "800",
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  summaryCardDark: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
  },
  summaryCardLight: {
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
  },
  summaryNumber: {
    color: "#0ea5e9",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 2,
  },
  actionRow: {
    marginBottom: 14,
  },
  addButton: {
    backgroundColor: "#0ea5e9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  addButtonText: {
    color: "#f9fafb",
    fontWeight: "900",
    fontSize: 15,
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#475569",
    backgroundColor: "#020617",
  },
  filterChipActive: {
    backgroundColor: "#0ea5e9",
    borderColor: "#38bdf8",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#cbd5e1",
  },
  filterChipTextActive: {
    color: "#ffffff",
  },
  listContent: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 20,
  },
});
