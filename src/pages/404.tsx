import { Box, Divider, Typography } from '@mui/material';
import React from 'react';

const Error404 = () => {
	return (
		<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
			<Typography variant='h3'>404</Typography>
			<Divider sx={{ width: '50%', my: 2 }} />
			<Typography variant='h4'>Not Found</Typography>
		</Box>
	);
};

export default Error404;