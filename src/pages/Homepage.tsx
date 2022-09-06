import { Box, IconButton, MobileStepper, Typography, Grid, Button } from '@mui/material'
import axios from 'axios'
import React, { useRef } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'
import CustomAppBar from '../components/AppBar'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Container } from '@mui/system'
import YoutubeIframe from '../components/YoutubeIframe'
import CustomDrawer from '../components/Drawer'

axios.defaults.withCredentials = true

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)
const navItems = ['Tentang', 'Konten', 'Jadwal Pelayan']


const Homepage = (): JSX.Element => {
	const tentangRef = useRef<null | HTMLDivElement>(null)
	const kontenRef = useRef<null | HTMLDivElement>(null)
	const jadwalRef = useRef<null | HTMLDivElement>(null)
	const [mobileOpen, setMobileOpen] = React.useState<boolean>(false)
	const [carousels, setCarousels] = React.useState<Array<Carousel>>([])
	const [youtube, setYoutube] = React.useState<Array<Youtube>>([])
	const [activeStep, setActiveStep] = React.useState(0)
	const maxSteps = carousels.length

	const handleDrawerToggle = (): void => {
		setMobileOpen(!mobileOpen)
	}

	React.useEffect(() => {
		getCarousel()
		getYoutube()
	}, [])

	const getCarousel = async (): Promise<void> => {
		await axios.get('http://localhost:8000/api/carousel/getAll').then(({ data }) => {
			// console.log(data)
			setCarousels([])
			data.map((el: Carousel) => (
				setCarousels((prev) => ([...prev, el]))
			))
		}).catch((error) => console.log(error))
	}

	const getYoutube = async (): Promise<void> => {
		await axios.get('http://localhost:8000/api/youtube/getAll').then(({ data }) => {
			setYoutube([])
			data.map((el: Youtube) => {
				setYoutube((prev) => ([...prev, el]))
			})
		})
	}

	const handleStepChange = (step: number): void => {
		setActiveStep(step)
	}

	const handleButtonChange = (f: string): void => {
		if (f == 'back') return setActiveStep((prev) => prev > 0 ? prev - 1 : 0)
		if (f == 'forward') return setActiveStep((prev) => prev < (carousels.length - 1) ? prev + 1 : (carousels.length - 1))
	}

	const handleNav = (item: string): void => {
		switch (item) {
		case 'Tentang':
			tentangRef.current?.scrollIntoView({ behavior: 'smooth' })
			break
		case 'Konten':
			kontenRef.current?.scrollIntoView({ behavior: 'smooth' })
			break
		case 'Jadwal Pelayan':
			jadwalRef.current?.scrollIntoView({ behavior: 'smooth' })
			break
		default:
			break
		}
	}
	return (
		<>
			<CustomAppBar handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen}>
				{navItems.map(item => (
					<Button key={item} sx={{ color: '#fff' }} onClick={() => handleNav(item)}>{item}</Button>
				))}
			</CustomAppBar>
			<CustomDrawer navItems={navItems} handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} />
			<Box component="main">
				<AutoPlaySwipeableViews
					index={activeStep}
					onChangeIndex={handleStepChange}
					enableMouseEvents
					interval={10000}
					style={{ position: 'relative' }}
				>
					{carousels.map((step: Carousel, index) => (
						<div key={index}>
							<Box
								sx={{
									height: '100vh',
									display: 'block',
									overflow: 'hidden',
									width: '100%',
									backgroundImage: 'url(http://localhost:8000/carousels/' + step.image + ')',
									backgroundPosition: 'center',
									backgroundRepeat: 'no-repeat',
									backgroundSize: 'cover',
								}}
							>
							</Box>
						</div>
					))}
				</AutoPlaySwipeableViews>
				<Box sx={{
					position: 'absolute',
					width: '100%',
					top: 0,
				}}>
					<Box sx={{
						position: 'relative',
						height: '100vh',
						display: 'flex',
						px: { xs: 1, md: 10 },
						justifyContent: 'space-between',
						alignItems: 'center',
						zIndex: 1,
					}}>
						{[
							{ func: 'back', icon: <ArrowBackIosIcon key={1} fontSize='large' sx={{ color: 'white' }} /> },
							{ func: 'forward', icon: <ArrowForwardIosIcon key={2} fontSize='large' sx={{ color: 'white' }} /> }
						].map((icons, index) => (
							<IconButton key={index} size='large' onClick={() => handleButtonChange(icons.func)}>
								{icons.icon}
							</IconButton>
						))}
					</Box>
				</Box>
				<MobileStepper
					sx={(theme) => ({
						position: 'absolute',
						height: 70,
						backgroundColor: 'transparent',
						'& .MuiMobileStepper-dot': {
							backgroundColor: theme.palette.background
						},
						'& .MuiMobileStepper-dotActive': {
							backgroundColor: 'white'
						}
					})}
					activeStep={activeStep}
					steps={maxSteps}
					variant='dots'
					backButton={<div></div>}
					nextButton={<div></div>}
				/>
			</Box>
			<Container ref={tentangRef}>
				<Box sx={{
					height: '100vh',
					py: 10,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-around',
					alignItems: 'center',
				}}>
					<Typography variant='h4' component='div' sx={{ fontWeight: 'bold', textAlign: 'center', }}>
                                    Youth GKJW Segaran Dlanggu
					</Typography>
					<Box component='img' src={require('../assets/20220809_1758131.png')} sx={{ maxWidth: '100%', height: 'auto' }} />
					<Typography variant='h6' component='div' sx={{ fontWeight: 'bold', textAlign: 'center', }}>
                                    Adalah sebuah media yang digunakan
                                    untuk meletakkan berbagai informasi dan karya para pemuda dan
                                    pemudi GKJW Jemaat Segaran Dlanngu.
					</Typography>
				</Box>
			</Container>
			<Box sx={{ bgcolor: '#172121', color: '#fff', px: 5, py: 7 }} ref={kontenRef}>
				<Typography
					// component='div' 
					variant='h4'
					sx={{
						fontWeight: 'bold',
						pb: 7,
						textAlign: 'center',
					}}
				>
                              KONTEN
				</Typography>
				<Grid container spacing={4}>
					{youtube.map(e => (
						<Grid item xs={12} md={4} key={e.id} sx={{ my: { xs: 2 } }}>
							<Box>
								<YoutubeIframe videoId={e.videoId} title={e.title} />
								<Typography component='div' sx={{ textAlign: 'center', my: 1, }}>{e.title}</Typography>
							</Box>
						</Grid>
					))}
				</Grid>
			</Box>
			<Box sx={{ height: '100vh', px: 5, py: 7 }} ref={jadwalRef}>
				<Typography component='div' variant='h4' sx={{ fontWeight: 'bold', textAlign: 'center' }}>Jadwal Pelayan</Typography>
			</Box>

		</>
	)
}

export default Homepage



interface Carousel {
      id: number;
      image: string;
      label: string;
}

interface Youtube {
      title: string;
      description: string;
      url: string;
      videoId: string;
      seconds: number;
      timestamp: string;
      duration: Duration;
      views: number;
      genre: string;
      uploadDate: string;
      ago: string;
      image: string;
      thumbnail: string;
      author: Author;
      id: number;
      youtube_id: string;
      created_at: string;
      updated_at: string;
      user: User;
}

interface Duration {
      seconds: number;
      timestamp: string;
}

interface Author {
      name: string;
      url: string;
}

interface User {
      id: number;
      name: string;
      level: number;
      email: string;
      password: string;
      created_at: string;
      updated_at: string;
}