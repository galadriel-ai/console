import {User} from "@/types/user";

enum UserKeys {
  ID = "galUserId",
  USERNAME = "galUsername",
  EMAIL = "galEmail",
}

export function saveUserData(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem(UserKeys.ID, user.userId)
    localStorage.setItem(UserKeys.USERNAME, user.username)
    localStorage.setItem(UserKeys.EMAIL, user.email)
  }
}

export function removeUserData() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(UserKeys.ID)
      localStorage.removeItem(UserKeys.USERNAME)
      localStorage.removeItem(UserKeys.EMAIL)
    }
  } catch {
  }
}

export function getUserId(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(UserKeys.ID) || ""
  }
  return ""
}

export function getUsername(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(UserKeys.USERNAME) || ""
  }
  return ""
}

export function getEmail(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(UserKeys.EMAIL) || ""
  }
  return ""
}
