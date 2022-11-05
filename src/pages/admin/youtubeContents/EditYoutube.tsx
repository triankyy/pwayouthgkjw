import React from 'react';
import CardHeader from '@mui/material/CardHeader';
import { IconButton, Typography, TextField, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import CustomCard from '../../../components/Card';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import axios, { AxiosResponse } from 'axios';
import { getYoutube, updateYoutube } from '../../../utils/apiConstants';
import { IYoutube } from '../../../utils/interfaces';
import YoutubeIframe from '../../../components/YoutubeIframe';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import toastSwal from '../../../components/swal/toastSwal';

const EditYoutube: React.FC = () => {
	//Hooks
	const navigate = useNavigate();
	const param = useParams();
	React.useEffect(() => {
		getYoutubeContent();
	}, []);

	//States
	const [loading, setLoading] = React.useState<boolean>(false);
	const [yt, setYt] = React.useState<IYoutube>();
	const [ytUrl, setYtUrl] = React.useState<string>('');
	const [ytId, setYtId] = React.useState<string>('');

	//Functions
	const getYoutubeContent = async (): Promise<void> => {
		setLoading(true);
		await axios.get(getYoutube + param.id).then((res: AxiosResponse<IYoutube>) => {
			setYt(res.data);
			setYtUrl(res.data.url);
			setYtId(res.data.videoId);
			setLoading(false);
		});
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { target: {value} } = e;
		const id = value.split('https://youtube.com/watch?v=');
		setYtUrl(value);
		setYtId(id[1]);
	};
	const handleSubmit = async (): Promise<void> => {
		if(loading) return;
		setLoading(true);
		await axios
			.patch(updateYoutube + param.id, {youtube_id: ytId})
			.then((res) => {
				setLoading(false);
				toastSwal({icon: 'success', title: 'Berhasil menyimpan data!'});
				navigate(-2);
			}).catch((err) => {
				setLoading(false);
				toastSwal({icon: 'error', title: err.data.message});
			});
	};

	//Render
	return (
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
							Edit data youtube
						</Typography>
					} />
				{loading && (<LinearProgress />)}
				<Divider />
				<Container sx={{mt: 2}}>
					<Grid container spacing={2}>
						<Grid item md={6} sm={12}>
							{yt ? (
								<YoutubeIframe
									videoId={ytId}
									title={yt.title}
								/>
							) : (
								<Box sx={{ height: 300, width: '100%', bgcolor: 'grey.400' }} />
							)}
						</Grid>
						<Grid item md={6} sm={12}>
							<TextField 
								label='Youtube ID'
								margin='normal'
								value={ytId || ''}
								disabled
								fullWidth/>
							<TextField 
								label='Link Youtube'
								margin='normal'
								value={ytUrl}
								onChange={handleChange}
								fullWidth/>
						</Grid>
						<Grid item xs={12}>
							<Button 
								variant='contained' 
								fullWidth 
								disabled={loading}
								onClick={handleSubmit}>
								Simpan Perubahan
							</Button>
						</Grid>
					</Grid>
				</Container>
			</>
		} />
	);
};

export default EditYoutube;