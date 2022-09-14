/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Checkbox, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { EnhancedTableHead, EnhancedTableToolbar, getComparator, HeadCell, Order, stableSort } from '../../../components/DataTable';
import CustomizedDialogs from '../../../components/Dialog';
import toastSwal from '../../../components/swal/toastSwal';
import { deleteCarousel as hapusCarousel, deleteManyCarousel, getAllCarousel, getCarousel, staticUrl } from '../../../utils/apiConstants';

const Carousel = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = React.useState<boolean>(false);
	const [carousels, setCarousels] = React.useState<Array<CarouselData>>([]);
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof CarouselData>('index');
	const [selected, setSelected] = React.useState<readonly string[]>([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
	const [preview, setPreview] = React.useState<any>();

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof CarouselData,
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelected = carousels.map((n) => n.id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected: readonly string[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}
		setSelected(newSelected);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (name: string) => selected.indexOf(name) !== -1;

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
            page > 0 ? Math.max(0, (1 + page) * rowsPerPage - carousels.length) : 0;

	React.useEffect(() => {
		getCarousels();
	}, []);

	const handleCloseDialog = () => {
		setSelected([]);
		setDialogOpen(false);
	};

	const getCarousels = async (): Promise<void> => {
		setLoading(true);
		await axios.get(getAllCarousel).then((res: AxiosResponse<any, any>) => {
			const data: [] = res.data;
			setCarousels([]);
			data.map((el: any, index: number) => {
				const date = moment(el.created_at).format('DD-MM-YYYY');
				setCarousels((prev) => [...prev, {
					index: index+1, 
					label: el.label, 
					image: el.image, 
					id: el.id.toString(), 
					user: `${date} (${el.user.name})`
				}]);
			});
			setLoading(false);
		});
	};

	const viewCarousel = async (id: number): Promise<void> => {
		await axios.get(getCarousel + id).then((res) => {
			setPreview(res.data);
			setDialogOpen(true);
		});
	};

	const deleteCarousel = async (): Promise<void> => {
		Swal.fire({
			title: 'Yakin ingin menghapus data?',
			text: 'Data tidak dapat dikembalikan setelah dihapus!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Hapus data',
			cancelButtonText: 'Batalkan',
			reverseButtons: true
		}).then(async (result) => {
			if (result.isConfirmed) {
				if (selected.length > 1) {
					const ids = selected.map(str => Number(str));
					await axios.delete(deleteManyCarousel, {data: { ids }}).then(() => {
						toastSwal({ icon: 'success', title: 'Data berhasil dihapus!' });
						getCarousels();
						setSelected([]);
					}).catch(err => toastSwal({ icon: 'error', title: err?.data?.message }));
				} else {
					await axios.delete(hapusCarousel + selected[0]).then(() => {
						toastSwal({ icon: 'success', title: 'Data berhasil dihapus!' });
						getCarousels();
						setSelected([]);
					}).catch(err => toastSwal({ icon: 'error', title: err?.data?.message }));
				}
			}
		});
	};
      
	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<EnhancedTableToolbar 
					numSelected={selected.length} 
					title='Data Carousel' 
					onCreate={() => navigate('create')}
					onView={() => viewCarousel(Number(selected[0]))} 
					onEdit={() => navigate('edit/' + selected[0])} 
					onDelete={() => deleteCarousel()} 
				/>
				{loading && (<LinearProgress />)}
				<TableContainer>
					<Table
						// sx={{ minWidth: 750 }}
						aria-labelledby="tableTitle"
						size='medium'
					>
						{/* <DataTable>

						</DataTable> */}
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={carousels.length} 
							headCells={headCells}							
						/>
						<TableBody>
							{/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
							{stableSort(carousels, getComparator(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => {
									const isItemSelected = isSelected(row.id);
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											onClick={(event) => handleClick(event, row.id)}
											role="checkbox"
											aria-checked={isItemSelected}
											tabIndex={-1}
											key={row.id}
											selected={isItemSelected}
										>
											<TableCell padding="checkbox">
												<Checkbox
													color="primary"
													checked={isItemSelected}
													inputProps={{
														'aria-labelledby': labelId,
													}}
												/>
											</TableCell>
											<TableCell
												component="th"
												id={labelId}
												scope="row"
												padding="none"
											>
												{row.index}
											</TableCell>
											<TableCell align="left">{row.label}</TableCell>
											<TableCell align="left">{row.image}</TableCell>
											<TableCell align="left">{row.user}</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: 53 * emptyRows,
									}}
								>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={carousels.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
			<CustomizedDialogs
				dialogOpen={dialogOpen}
				onDialogClose={handleCloseDialog}
				title={preview?.label}
				content={<Box component='img' src={`${staticUrl}carousels/${preview?.image}`} width='100%' />} />
		</Box>
	);
};

export default Carousel;

interface CarouselData {
      index: number;
      label: string;
      image: string;
	id: string;
	user: string;
}

const headCells: HeadCell[] = [
	{
		id: 'id',
		numeric: false,
		disablePadding: true,
		label: 'Index',
	},
	{
		id: 'label',
		numeric: false,
		disablePadding: false,
		label: 'Label',
	},
	{
		id: 'image',
		numeric: false,
		disablePadding: false,
		label: 'Image',
	},
	{
		id: 'user',
		numeric: false,
		disablePadding: false,
		label: 'Created',
	}
];