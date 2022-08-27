import { Box, IconButton, MobileStepper, Typography } from '@mui/material'
import axios from 'axios'
import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'
import DrawerAppBar from './components/AppBar'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Container } from '@mui/system'

axios.defaults.withCredentials = true

interface Carousel {
  id: number;
  image: string;
  label: string;
}

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

export default function App(): JSX.Element {
	const [mobileOpen, setMobileOpen] = React.useState<boolean>(false)
	const [carousels, setCarousels] = React.useState<Array<Carousel>>([])
	const [activeStep, setActiveStep] = React.useState(0)
	const maxSteps = carousels.length

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}

	React.useEffect(() => {
		getCarousel()
	}, [])

	const getCarousel = async () => {
		await axios.get('http://localhost:8000/api/carousel/getAll').then(({ data }) => {
			console.log(data)
			setCarousels([])
			data.map((el: Carousel) => (
				setCarousels((prev) => ([...prev, el]))
			))
		}).catch((error) => console.log(error))
	}

	const handleStepChange = (step: number) => {
		setActiveStep(step)
	}

	const handleButtonChange = (f: string) => {
		if (f == 'back') return setActiveStep((prev) => prev > 0 ? prev - 1 : 0)
		if (f == 'forward') return setActiveStep((prev) => prev < 2 ? prev + 1 : 2)
	}

	return (
		<>
			<DrawerAppBar handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} />
			<Box component="main">
				<AutoPlaySwipeableViews
					index={activeStep}
					onChangeIndex={handleStepChange}
					enableMouseEvents
					interval={10000}
					style={{position: 'relative'}}
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
						px: {xs: 1, md: 10},
						justifyContent: 'space-between',
						alignItems: 'center',
						zIndex: 1,
					}}>
						{[
							{func: 'back', icon: <ArrowBackIosIcon key={1} fontSize='large' sx={{color: 'white'}} />},
							{func: 'forward', icon: <ArrowForwardIosIcon key={2} fontSize='large' sx={{color: 'white'}} />}
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
			<Container>
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
					<Box component='img' src={require('./assets/20220809_1758131.png')} sx={{maxWidth: '100%', height: 'auto'}} />
					<Typography variant='h6' component='div' sx={{ fontWeight: 'bold', textAlign: 'center', }}>
						Adalah sebuah media yang digunakan
						untuk meletakkan berbagai informasi dan karya para pemuda dan
						pemudi GKJW Jemaat Segaran Dlanngu.
					</Typography>
				</Box>
			</Container>
			<Box component='div' sx={{ bgcolor: '#1E1E1E', color: '#fff' }}>
				<h1>hahah</h1>
			</Box>

		</>
	)
}
