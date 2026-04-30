import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export type Theme = "light" | "dark";

const THEME_KEY = "productivity_theme";
const NAME_KEY = "productivity_name";

function webGet(key: string): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(key);
}

function webSet(key: string, value: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, value);
}

export async function saveTheme(theme: Theme): Promise<void> {
  try {
    if (Platform.OS === "web") {
      webSet(THEME_KEY, theme);
      return;
    }

    await SecureStore.setItemAsync(THEME_KEY, theme);
  } catch (e) {
    console.warn("Failed to save theme", e);
  }
}

export async function loadTheme(): Promise<Theme | null> {
  try {
    const value =
      Platform.OS === "web"
        ? webGet(THEME_KEY)
        : await SecureStore.getItemAsync(THEME_KEY);

    if (value === "light" || value === "dark") {
      return value;
    }

    return null;
  } catch (e) {
    console.warn("Failed to load theme", e);
    return null;
  }
}

export async function saveName(name: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      webSet(NAME_KEY, name);
      return;
    }

    await SecureStore.setItemAsync(NAME_KEY, name);
  } catch (e) {
    console.warn("Failed to save name", e);
  }
}

export async function loadName(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return webGet(NAME_KEY);
    }

    const value = await SecureStore.getItemAsync(NAME_KEY);
    return value ?? null;
  } catch (e) {
    console.warn("Failed to load name", e);
    return null;
  }
}
