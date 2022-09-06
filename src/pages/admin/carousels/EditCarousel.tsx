/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, CardHeader, IconButton, Typography, Divider, Box, TextField, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CustomCard from '../../../components/Card'
import axios from 'axios'
import { apiUrl, rootUrl } from '../../../utils/config'
import toastSwal from '../../../components/swal/toastSwal'
import { useDropzone } from 'react-dropzone'


const EditCarousel = () => {
	const navigate = useNavigate()
	const param = useParams()
	const [preview, setPreview] = React.useState<any>()
	const [image, setImage] = React.useState<any>()
	const [label, setLabel] = React.useState('')
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

	React.useEffect(() => {
		getCarousel()
	}, [])

	const getCarousel = async () => {
		await axios.get(`${apiUrl}carousel/getOne/${param.id}`).then(res => {
			const data = res.data
			setLabel(data?.label)
			setPreview(`${rootUrl}carousels/${data?.image}`)
		}).catch(err => toastSwal({ icon: 'error', title: err?.data?.message }))
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { target: { value }} = e
		setLabel(value)
	}

	const handleSubmit = async () => {
		if (!image || !label) toastSwal({ icon: 'error', title: 'Image and labels cannot be empty!' })
		const data = new FormData()
		data.append('image', image)
		data.append('label', label)
		await axios.post(`${apiUrl}carousel/update/${param.id}`, data).then(() => {
			toastSwal({ icon: 'success', title: 'Carousel updated successfully!' })
			navigate(-1)
		}).catch(err => toastSwal({ icon: 'error', title: err?.data?.message }))
	}

	return (
		<>
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
                                                Edit Carousel
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
								value={label}
								label="Label"
								sx={{ mb: 2 }}
								onChange={handleChange}
							/>
							<Button variant='contained' fullWidth sx={{ mb: 2 }} onClick={handleSubmit}>
								Save Changes
							</Button>
						</Container>
					</>
				} />
			</Container>
		</>
	)
}

export default EditCarousel