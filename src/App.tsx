import axios from 'axios'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import { Carousel, CreateCarousel, EditCarousel } from './pages/admin/carousels'
import { CreateUser, DataUser, EditUser } from './pages/admin/users'
import Homepage from './pages/Homepage'
import Login from './pages/Login'

axios.defaults.withCredentials = true

export default function App(): JSX.Element {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Homepage />} />
				<Route path='/login' element={<Login />} />
				<Route path='/admin' element={<DashboardLayout />}>
					<Route index element={<h1>home</h1>} />
					<Route path='carousels'>
						<Route index element={<Carousel />} />
						<Route path='edit/:id' element={<EditCarousel />} />
						<Route path='create' element={<CreateCarousel />} />
					</Route>
					<Route path='users'>
						<Route index element={<DataUser />} />
						<Route path='edit/:id' element={<EditUser/>} />
						<Route path='create' element={<CreateUser/>} />
					</Route>
					<Route path='ytContents' element={<h1>ytContents</h1>} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
