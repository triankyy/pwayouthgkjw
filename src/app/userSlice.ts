/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit'

const initialState: InitialStateUser = {
	name: '',
	email: '',
	isLogged: false,
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setActiveUser: (state, action) => {
			state.name = action.payload.name
			state.email = action.payload.email
			state.isLogged = true
		},
		setUerLogOutState: state => {
			state.name = ''
			state.email = ''
			state.isLogged = false
		}
	}
})

export const { setActiveUser, setUerLogOutState } = userSlice.actions
export const selectUserName = (state: any) => state.user.userName
export const selectUserEmail = (state: any) => state.user.userEmail
export default userSlice.reducer
export interface InitialStateUser {
	name: string;
	email: string;
	isLogged: boolean;
}