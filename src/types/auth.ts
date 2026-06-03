export type LoginInput = {
  email: string
  password: string
}

export type AuthUser = {
  id: string
  name: string
  email: string
  role: "admin" | "student"
}

export type AuthResponse = {
  user: AuthUser
  token: string
}
