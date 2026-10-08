import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userInfo: null,
  isAuthenticated: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload
      state.isAuthenticated = true
    },
    logoutUser: (state) => {
      state.userInfo = null
      state.isAuthenticated = false
    },
  },
})

export const { setUser, logoutUser } = userSlice.actions
export default userSlice.reducer