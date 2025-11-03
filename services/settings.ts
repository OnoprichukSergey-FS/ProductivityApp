import * as SecureStore from "expo-secure-store";

export type Theme = "light" | "dark";

const THEME_KEY = "productivity_theme";
const NAME_KEY = "productivity_name";

export async function saveTheme(theme: Theme): Promise<void> {
  try {
    await SecureStore.setItemAsync(THEME_KEY, theme);
  } catch (e) {
    console.warn("Failed to save theme", e);
  }
}

export async function loadTheme(): Promise<Theme | null> {
  try {
    const value = await SecureStore.getItemAsync(THEME_KEY);
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
    await SecureStore.setItemAsync(NAME_KEY, name);
  } catch (e) {
    console.warn("Failed to save name", e);
  }
}

export async function loadName(): Promise<string | null> {
  try {
    const value = await SecureStore.getItemAsync(NAME_KEY);
    return value ?? null;
  } catch (e) {
    console.warn("Failed to load name", e);
    return null;
  }
}
