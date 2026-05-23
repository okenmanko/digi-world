import { supabase } from "./supabase";

const USER_KEY = "digi_world_user";

export type User = {
  name: string;
  phone: string;
};

export function saveUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(USER_KEY);
}

export function logoutUser() {
  localStorage.removeItem(USER_KEY);
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}