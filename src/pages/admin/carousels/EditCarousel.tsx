/* eslint-disable @typescript-eslint/no-explicit-any */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, CardHeader, Container, Divider, IconButton, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useParams } from 'react-router-dom';
import CustomCard from '../../../components/Card';
import toastSwal from '../../../components/swal/toastSwal';
import { getCarousel as getOneCarousel, rootUrl, updateCarousel } from '../../../utils/apiConstants';


const EditCarousel = () => {
	const navigate = useNavigate();
	const param = useParams();
	const [preview, setPreview] = React.useState<any>();
	const [image, setImage] = React.useState<any>();
	const [label, setLabel] = React.useState('');
	const { getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg'] },
		onDrop: acceptedFiles => {
			acceptedFiles.map(file => {
				const filename = file.name;
				const ext = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
				if (ext == 'jpg' || ext == 'png') {
					setPreview(URL.createObjectURL(file));
					setImage(file);
				}
			});
		}
	});

	React.useEffect(() => {
		getCarousel();
	}, []);

	const getCarousel = async () => {
		await axios.get(getOneCarousel + param.id).then(res => {
			const data = res.data;
			setLabel(data?.label);
			setPreview(`${rootUrl}carousels/${data?.image}`);
		}).catch(err => toastSwal({ icon: 'error', title: err?.data?.message }));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { target: { value }} = e;
		setLabel(value);
	};

	const handleSubmit = async () => {
		if (!image || !label) toastSwal({ icon: 'error', title: 'Kolom gambar dan label tidak boleh kosong!' });
		const data = new FormData();
		data.append('image', image);
		data.append('label', label);
		await axios.post(updateCarousel + param.id, data).then(() => {
			toastSwal({ icon: 'success', title: 'Data carousel berhasil diupdate!' });
			navigate(-1);
		}).catch(err => toastSwal({ icon: 'error', title: err?.data?.message }));
	};

	return (
		<>
			<>
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
                                                Edit data carousel
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
											{'*Ketuk gambar untuk menghapus'}
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
										{'Drag \'n\' drop gambar di sini, atau klik untuk memilih gambar'}
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
								Simpan perubahan
							</Button>
						</Container>
					</>
				} />
			</>
		</>
	);
};

export default EditCarousel;