import axios from 'axios'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { setActiveUser, setUerLogOutState } from '../app/userSlice'
import { apiUrl } from '../utils/config'

import MailIcon from '@mui/icons-material/Mail'
import MenuIcon from '@mui/icons-material/Menu'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Copyright from '../components/Copyright'

import PersonIcon from '@mui/icons-material/Person'
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel'
import YouTubeIcon from '@mui/icons-material/YouTube'

const drawerWidth = 240

interface Menu {
	title: string;
	icon: JSX.Element;
	link: string;
}

const menu: Menu[] = [
	{title: 'Carousels', icon: <ViewCarouselIcon />, link: 'carousels' },
	{title: 'Users', icon: <PersonIcon />, link: 'users' },
	{title: 'Youtube Contents', icon: <YouTubeIcon />, link: 'ytContents' },
]

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
	open?: boolean;
}>(({ theme, open }) => ({
	flexGrow: 1,
	padding: theme.spacing(3),
	transition: theme.transitions.create('margin', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	marginLeft: `-${drawerWidth}px`,
	...(open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	}),
}))

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(() => ({
	zIndex: 9999,
}))

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: 'flex-end',
}))


const DashboardLayout = () => {
	const [open, setOpen] = React.useState(true)
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { pathname } = useLocation()
	
	React.useEffect(() => {
		checkUser()
	}, [])
	
	const toggleDrawer = () => {
		setOpen(!open)
	}

	const checkUser = async () => {
		await axios.get(`${apiUrl}auth`).then((res) => {
			dispatch(setActiveUser({
				name: res.data?.name,
				email: res.data?.email,
				isLogged: true
			}))
		}).catch(() => logout())
	}

	const logout = async () => {
		await axios.get(`${apiUrl}auth/logout`).then(() => {
			dispatch(setUerLogOutState())
			navigate('/', { replace: true })
		}).catch(() => {
			dispatch(setUerLogOutState())
			navigate('/', { replace: true })
		})
	}
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
						{menu.map((val) => (
							<ListItem disablePadding key={val.title} onClick={() => navigate(val.link)} selected={pathname.includes(val.link)}>
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
						{['All mail', 'Trash', 'Spam'].map((text, index) => (
							<ListItem key={text} disablePadding>
								<ListItemButton>
									<ListItemIcon>
										{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
									</ListItemIcon>
									<ListItemText primary={text} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Drawer>
				<Main open={open}>
					<DrawerHeader />
					<Outlet />
					<Copyright />
				</Main>
			</Box>
		</>
	)
}

export default DashboardLayout