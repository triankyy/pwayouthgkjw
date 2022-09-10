/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { RootState } from '../app/store';
import { setActiveUser, setUerLogOutState } from '../app/userSlice';
import Copyright from '../components/Copyright';
import toastSwal from '../components/swal/toastSwal';
import { authApi, getAllCarousel, loginApi, rootUrl } from '../utils/apiConstants';

export default function Login(): JSX.Element {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);
	const navigate: NavigateFunction = useNavigate();
	const [background, setBackground] = React.useState<Background[]>([]);
	const [error, setError] = React.useState<{email: boolean, password: boolean}>({email: false, password: false});

	React.useEffect(() => {
		getBackground();
		if(user.isLogged) {
			checkUser();
			return navigate('/admin', { replace: true });
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
			navigate('/admin', { replace: true });
		}).catch(() => logout());
	};

	const logout = async () => {
		dispatch(setUerLogOutState());
		navigate('/login', { replace: true });
	};

	const getBackground = async (): Promise<void> => {
		await axios.get(getAllCarousel).then(({ data }) => {
			setBackground([]);
			data.map((el: Background) => setBackground((prev) => ([...prev, el])));
		}).catch((error) => console.log(error));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		if (!data.get('email')) setError({email: true, password: false});

		await axios.post(loginApi, {
			email: data.get('email'),
			password: data.get('password'),
		}).then((res: AxiosResponse<any, any>) => {
			dispatch(setActiveUser({
				uid: res.data?.id,
				name: res.data?.name,
				email: res.data?.email,
				isLogged: true
			}));
			toastSwal({ icon: 'success', title: `Selamat datang ${res.data?.name}!`});
			return navigate('/admin', { replace: true });
		}).catch((err) => {
			toastSwal({ icon: 'error', title: err?.response?.data?.message });
		});
	};

	return (
		<Box
			sx={{ 
				height: '100vh', 
				width: '100%', 
				display: 'flex', 
				justifyContent: 'center', 
				alignItems: 'center',
				backgroundImage: `url(${rootUrl}carousels/${background[Math.floor(Math.random() * 3)]?.image})`,
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
			}}
		>
			<Card sx={{ maxWidth: 450, mx: 2 }} elevation={24}>
				<CardContent>
					<Container>
						<Box
							sx={{
								marginTop: 8,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<Box sx={{ 
								m: 1, 
								bgcolor: '#172121', 
								borderRadius: '50%',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								p: 1
							}}>
								<img src={require('../assets/logoGKJWSegaranDlanggu.png')} alt="" />
							</Box>
							<Typography component="h1" variant="h5" sx={{ mt: 2, textAlign: 'center' }}>
								{'Youth GKJW Segaran Dlanggu'}
							</Typography>
							<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
								<TextField
									margin="normal"
									error={error.email}
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									autoFocus
								/>
								<TextField
									margin="normal"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 3, mb: 2 }}
								>
									Masuk
								</Button>
							</Box>
						</Box>
						<Copyright sx={{ mt: 8, mb: 4 }} />
					</Container>
				</CardContent>
			</Card>
		</Box>
	);
}

interface Background {
      id: number;
      image: string;
      label: string;
}