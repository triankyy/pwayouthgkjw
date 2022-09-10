import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUerLogOutState } from '../app/userSlice';
import { logoutApi } from '../utils/apiConstants';
import useWindowDimensions from '../hooks/windowDimensions';
import toastSwal from '../components/swal/toastSwal';

import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Copyright from '../components/Copyright';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import YouTubeIcon from '@mui/icons-material/YouTube';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';


const drawerWidth = 240;

interface DataMenu {
	title: string;
	icon: JSX.Element;
	link: string;
}

const dataMaster: Array<DataMenu> = [
	{title: 'Carousels', icon: <ViewCarouselIcon />, link: 'carousels' },
	{title: 'Youtubes', icon: <YouTubeIcon />, link: 'ytContents' },
	{title: 'Users', icon: <PersonIcon />, link: 'users' },
];

const dataFitur: Array<DataMenu> = [
	{title: 'Jadwal Pelayanan', icon: <CalendarMonthIcon />, link: '' },
	{title: 'Bazar', icon: <StorefrontIcon />, link: '' },
];

const etc: Array<DataMenu> = [
	{title: 'Pengaturan', icon: <SettingsIcon />, link: '' },
	{title: 'Keluar', icon: <LogoutIcon />, link: '/logout' },
];

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
	open?: boolean;
}>(({ theme, open }) => ({
	flexGrow: 1,
	width: '100%',
	padding: theme.spacing(1),
	transition: theme.transitions.create('margin', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	marginLeft: `-${drawerWidth}px`,
	[theme.breakpoints.up('md')] : {
		padding: theme.spacing(3),
		...(open && {
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
			marginLeft: 0,
		}),
	}
}));

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(() => ({
	zIndex: 9999,
}));

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: 'flex-end',
}));


const DashboardLayout = () => {
	const dispatch = useDispatch();
	const { width } = useWindowDimensions();
	const [open, setOpen] = React.useState(width > 600 ? true : false);
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { location: { href }} = window;
	
	const toggleDrawer = () => {
		setOpen(!open);
	};

	const logout = async () => {
		await axios.get(logoutApi).then(() => {
			dispatch(setUerLogOutState());
			navigate('/login', { replace: true });
			toastSwal({ icon: 'success', title: 'Berhasil Logout!'});
		}).catch(() => {
			dispatch(setUerLogOutState());
			navigate('/login', { replace: true });
			toastSwal({ icon: 'success', title: 'Berhasil Logout!'});
		});
	};

	return (
		<>
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				<AppBar position="fixed" open={open}>
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={toggleDrawer}
							edge="start"
							sx={{ mr: 2 }}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" noWrap component="div">
							Youth GKJW Segaran
						</Typography>
					</Toolbar>
				</AppBar>
				<Drawer
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						'& .MuiDrawer-paper': {
							width: drawerWidth,
							boxSizing: 'border-box',
						},
					}}
					variant="persistent"
					anchor="left"
					open={open}
					PaperProps={{ elevation: 5 }}
				>
					<DrawerHeader />
					<List>
						<ListItem disablePadding>
							<ListItemButton onClick={() => navigate('')} selected={href.split('/').pop() == 'admin'}>
								<ListItemIcon>
									<DashboardOutlinedIcon />
								</ListItemIcon>
								<ListItemText primary='Dashboard' />
							</ListItemButton>
						</ListItem>
					</List>
					<Divider />
					<List>
						<ListItem disablePadding>
							<ListItemButton disabled disableRipple>
								<ListItemText primary={'Fitur'} />
							</ListItemButton>
						</ListItem>
						{dataFitur.map((val, index) => (
							<ListItem key={index} disablePadding>
								<ListItemButton>
									<ListItemIcon>
										{val.icon}
									</ListItemIcon>
									<ListItemText primary={val.title} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
					<Divider />
					<List>
						<ListItem disablePadding>
							<ListItemButton disabled disableRipple>
								<ListItemText primary={'Data Master'} />
							</ListItemButton>
						</ListItem>
						{dataMaster.map((val) => (
							<ListItem disablePadding key={val.title}>
								<ListItemButton onClick={() => navigate(val.link)} selected={pathname.includes(val.link)}>
									<ListItemIcon>
										{val.icon}
									</ListItemIcon>
									<ListItemText primary={val.title} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
					<List sx={{flexGrow: 1, display: 'flex', alignItems: 'end'}}>
						<Box sx={{width: '100%'}}>
							{etc.map((val: DataMenu, index: number) => (
								<ListItem disablePadding key={index}>
									<ListItemButton onClick={() => val.link == '/logout' ? logout() : navigate(val.link)}>
										<ListItemIcon>
											{val.icon}
										</ListItemIcon>
										<ListItemText primary={val.title} />
									</ListItemButton>
								</ListItem>
							))}
						</Box>
					</List>
				</Drawer>
				<Main open={open}>
					<DrawerHeader />
					<Outlet />
					<Copyright />
				</Main>
			</Box>
		</>
	);
};

export default DashboardLayout;