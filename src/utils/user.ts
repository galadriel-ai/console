import {User} from "@/types/user";


export function saveUserData(user: User) {
  if (typeof window !== "undefined") {

    localStorage.setItem("galUsername", user.username)
    localStorage.setItem("galEmail", user.email)
  }
}

export function removeUserData() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("galUsername")
      localStorage.removeItem("galEmail")
    }
  } catch {
  }
}

export function getUsername(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("galUsername") || ""
  }
  return ""
}

export function getEmail(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("galEmail") || ""
  }
  return ""
}
