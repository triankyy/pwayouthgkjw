import { Box, Button, MobileStepper } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import axios from 'axios'
import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'
import DrawerAppBar from './components/AppBar'

axios.defaults.withCredentials = true

interface Carousel {
  id: number;
  image: string;
  label: string;
}

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

const useStyles = makeStyles({
	root: {
		backgroundColor: 'transparent'
	},
	dot: {
		backgroundColor: '#008000'
	},
	dotActive: {
		backgroundColor: '#3f51b5'
	}
})

export default function App(): JSX.Element {
	const classes = useStyles()
	const theme = useTheme()
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
		await axios.get('http://localhost:8000/carousel/').then(({ data }) => {
			console.log(data)
			setCarousels([])
			data.map((el: Carousel) => (
				setCarousels((prev) => ([...prev, el]))
			))
		})
	}

	const handleStepChange = (step: number) => {
		setActiveStep(step)
	}

	return (
		<Box >
			<DrawerAppBar handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} />
			<Box component="main">
				<AutoPlaySwipeableViews
					axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
					index={activeStep}
					onChangeIndex={handleStepChange}
					enableMouseEvents
					// interval={10000}
				>
					{carousels.map((step, index) => (
						<div key={step.label}>
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
							/>
						</div>
					))}
				</AutoPlaySwipeableViews>
				<MobileStepper 
					classes={{
						root: classes.root,
						dotActive: classes.dotActive, 
						dot: classes.dot
					}}
					sx={{position: 'absolute'}}
					activeStep={activeStep}
					steps={maxSteps}
					variant='dots' 
					backButton={<Button>aa</Button>} 
					nextButton={<Button>aa</Button>} />
			</Box>
			<Box sx={{height: '10vh'}}>
				<h1>cobaa</h1>
			</Box>
		</Box>
	)
}
