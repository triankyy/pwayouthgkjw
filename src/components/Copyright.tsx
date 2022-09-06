import React from 'react'
import { Typography, Link, Box } from '@mui/material'


export default function Copyright(props: any): JSX.Element {
	return (
		<Box sx={{ my: 3 }}>
			<Typography variant="body2" color="text.secondary" align="center" {...props}>
				{'Developed By '}
				<Link color="inherit" href="https://www.instagram.com/kyy.owo/" target='_blank'>
					Kyy
				</Link>
			</Typography>
		</Box>
	)
}