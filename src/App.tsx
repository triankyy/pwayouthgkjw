import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RootState } from './app/store';
import { setActiveUser, setUerLogOutState } from './app/userSlice';
import DashboardLayout from './layouts/DashboardLayout';
import Error404 from './pages/404';
import { Carousel, CreateCarousel, EditCarousel } from './pages/admin/carousels';
import Home from './pages/admin/Home';
import { CreateUser, DataUser, EditUser } from './pages/admin/users';
import { YoutubeContents } from './pages/admin/youtubeContents';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import { authApi, logoutApi } from './utils/apiConstants';

axios.defaults.withCredentials = true;

export default function App(): JSX.Element {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);

	React.useEffect(() => {
		if (user.isLogged) {
			checkUser();
		}
	}, []);

	const checkUser = async () => {
		await axios.get(authApi).then((res) => {
			dispatch(setActiveUser({
				uid: res.data?.id,
				name: res.data?.name,
				email: res.data?.email,
				isLogged: true
			}));
		}).catch(() => logout());
	};

	const logout = async () => {
		await axios.get(logoutApi).then(() => {
			dispatch(setUerLogOutState());
		}).catch(() => {
			dispatch(setUerLogOutState());
		});
	};
	return (
		<BrowserRouter>
			<Routes>
				<Route path='*' element={<Error404 />} />
				<Route path='/' element={<Homepage />} />
				<Route path='/login' element={<Login />} />
				{user.isLogged && (
					<Route path='/admin' element={<DashboardLayout />}>
						<Route index element={<Home/>} />
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
						<Route path='ytContents'>
							<Route index element={<YoutubeContents/>} />
						</Route>
					</Route>
				)}
			</Routes>
		</BrowserRouter>
	);
}
