import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

export default function CustomCard(props: Props) {
	const { content, media, ...rest } = props
	return (
		<Card {...rest}>
			{media}
			<CardContent sx={{ p: 0 }}>
				{content}
			</CardContent>
		</Card>
	)
}

interface Props {
      media?: JSX.Element
      content: JSX.Element
}