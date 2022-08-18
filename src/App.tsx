import { Box, Button, Toolbar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import React from 'react';
import DrawerAppBar from './components/AppBar';
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'

axios.defaults.withCredentials = true;

interface Carousel {
  id: number;
  image: string;
  label: string;
}

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export default function App(): JSX.Element {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const [carousels, setCarousels] = React.useState<Array<Carousel>>([])
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = carousels.length;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  React.useEffect(() => {
    getCarousel()
  }, [])

  const getCarousel = async () => {
    await axios.get('http://localhost:8000/carousel/').then(({ data }) => {
      setCarousels([])
      data.map((el: Carousel) => (
        setCarousels((prev) => ([...prev, el]))
      ))
    })
  }

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <DrawerAppBar handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} />
      <Box component="main">
        <AutoPlaySwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          interval={10000}
        >
          {carousels.map((step, index) => (
            <div key={step.label}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Box
                  component="img"
                  sx={{
                    height: '100vh',
                    display: 'block',
                    overflow: 'hidden',
                    width: '100%',
                  }}
                  src={'http://localhost:8000/carousels/' + step.image}
                  alt={step.label}
                />
              ) : null}
              <h1>{step.label}</h1>
            </div>
          ))}
        </AutoPlaySwipeableViews>
      </Box>
    </Box>
  );
}
