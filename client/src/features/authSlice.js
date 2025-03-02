import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    role: null
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user
            state.role = action.payload.role
        },

        logout: (state, action) => {
            state.user = null
            state.role = null
        }
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer