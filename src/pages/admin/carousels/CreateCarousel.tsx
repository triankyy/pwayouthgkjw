/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { TextField, Typography, Container, Box, Button, IconButton, CardHeader, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CustomCard from '../../../components/Card'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { apiUrl } from '../../../utils/config'
import toastSwal from '../../../components/swal/toastSwal'

const CreateCarousel = () => {
	const navigate = useNavigate()
	const [preview, setPreview] = React.useState<any>()
	const [image, setImage] = React.useState<any>()
	const [label, setLabel] = React.useState<string>('')
	const { getRootProps, getInputProps } = useDropzone({ 
		maxFiles: 1, 
		accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg'] },
		onDrop: acceptedFiles => {
			acceptedFiles.map(file => {
				const filename = file.name
				const ext = filename.substring(filename.lastIndexOf('.') + 1, filename.length)
				if (ext == 'jpg' || ext == 'png') {
					setPreview(URL.createObjectURL(file))
					setImage(file)
				}
			})
		}
	})

	const handleSubmit = async () => {
		if (!image || !label) toastSwal({ icon: 'error', title: 'Image and labels cannot be empty!'})
		const data = new FormData()
		data.append('image', image)
		data.append('label', label)
		await axios.post(`${apiUrl}carousel/create`, data).then(() => {
			toastSwal({ icon: 'success', title: 'Carousel created successfully!'})
			navigate(-1)
		}).catch(err => toastSwal({ icon: 'error', title: err?.data?.message }))
	}
	return (
		<Container>
			<CustomCard content={
				<>
					<CardHeader 
						avatar={
							<IconButton onClick={() => navigate(-1)}>
								<ArrowBackIcon />
							</IconButton>
						}
						title={
							<Typography variant='h5'>
                                                Add Carousel
							</Typography>
						} />
					<Divider />
					<Container sx={{ mt: 2 }}>
						{preview ? (
							<>
								<Box sx={{ mb: 2 }}>
									<Box 
										component='img' 
										src={preview} 
										width='100%' 
										onClick={() => setPreview('')}
										sx={{ 
											borderRadius: 1,
											cursor: 'pointer',
										}} />
									<Typography sx={{ color: 'grey.500' }}>
										{'*To delete an uploaded image, just tap on the image'}
									</Typography>
								</Box>
							</>
						) : (
							<Box component='div' {...getRootProps()} sx={{
								height: 200,
								borderRadius: 1,
								border: 1,
								borderColor: 'grey.400',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								mb: 2,
								cursor: 'pointer',
								':hover': {
									borderColor: 'black'
								}
							}}>
								<input {...getInputProps()} />
								<Typography sx={{ textAlign: 'center' }}>
									{'Drag \'n\' drop image here, or click to select image'}
								</Typography>
							</Box>
						)}
						<TextField
							fullWidth
							required
							id="outlined-required"
							label="Label"
							sx={{ mb: 2 }}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
						/>
						<Button variant='contained' fullWidth sx={{ mb: 2 }} onClick={handleSubmit}>
                                          Submit
						</Button>
					</Container>
				</>
			} />
		</Container>
	)
}

export default CreateCarousel