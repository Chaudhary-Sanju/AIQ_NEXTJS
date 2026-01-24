import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: {},
    },
    reducers: {
        setUser: (state, action) => {
            state.value = action.payload;

        },
        clearUser: (state) => {
            state.value = {};
        },
    },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
