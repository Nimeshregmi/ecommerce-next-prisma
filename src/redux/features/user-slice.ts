import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type UserState = {
  isAuthenticated: boolean
  userId: string | null
  customerName: string | null
  email: string | null
  role: string | null
}

const initialState: UserState = {
  isAuthenticated: false,
  userId: null,
  customerName: null,
  email: null,
  role: null,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        userId: string
        customerName: string
        email: string
        role?: string
      }>,
    ) => {
      state.isAuthenticated = true
      state.userId = action.payload.userId
      state.customerName = action.payload.customerName
      state.email = action.payload.email
      state.role = action.payload.role || "user"
    },
    clearUser: (state) => {
      state.isAuthenticated = false
      state.userId = null
      state.customerName = null
      state.email = null
      state.role = null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer
