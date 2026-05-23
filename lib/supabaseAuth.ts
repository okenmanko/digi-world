import { supabase } from "./supabase";

export async function signUpUser({
  name,
  phone,
  email,
  password,
}: {
  name: string;
  phone: string;
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return {
      success: false,
      error: error.message,
    };
  }

  const user = data.user;

  if (!user) {
    return {
      success: false,
      error: "User yaratilmadi",
    };
  }

  await supabase.from("profiles").insert({
    user_id: user.id,
    name,
    phone,
    email,
  });

  return {
    success: true,
    user,
  };
}

export async function signInUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    user: data.user,
  };
}

export async function signOutUser() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}