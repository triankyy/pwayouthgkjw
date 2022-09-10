import React from 'react';
import { Box, Checkbox, LinearProgress, Link, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from '@mui/material';
import { EnhancedTableHead, EnhancedTableToolbar, getComparator, HeadCell, Order, stableSort } from '../../../components/DataTable';
import axios, { AxiosResponse } from 'axios';
import { getAllYoutube } from '../../../utils/apiConstants';
import { IYoutube } from '../../../utils/interfaces';
import CustomizedDialogs from '../../../components/Dialog';
import YoutubeIframe from '../../../components/YoutubeIframe';


const Youtubes: React.FC = () => {
	const [loading, setLoading] = React.useState<boolean>(false);
	const [yt, setYt] = React.useState<Array<Yt>>([]);
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof Yt>('index');
	const [selected, setSelected] = React.useState<readonly string[]>([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

	const handleCloseDialog = () => {
		setSelected([]);
		setDialogOpen(false);
	};

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof Yt,
	): void => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>): void => {
		if (event.target.checked) {
			const newSelected = yt.map((n) => n.id.toString());
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event: React.MouseEvent<unknown>, name: string): void => {
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

	const handleChangePage = (event: unknown, newPage: number): void => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (name: string) => selected.indexOf(name) !== -1;

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - yt.length) : 0;

	React.useEffect(() => {
		getYoutubeContents();
	}, []);

	const getYoutubeContents = async (): Promise<void> => {
		setLoading(true);
		await axios.get(getAllYoutube).then((val: AxiosResponse<IYoutube[]>) => {
			setYt([]);
			val.data.map((el: IYoutube, index) => {
				setYt((prev) => [...prev, {
					index,
					id: el.id,
					youtube_id: el.youtube_id,
					title: el.title,
					description: el.description,
					url: el.url,
					thumbnail: el.thumbnail
				}]);
			});
			setLoading(false);
		});
	};

	const viewYoutube = async (id: number): Promise<void> => {
		setDialogOpen(true);
	};


	return (
		<>
			<Box width='100%'>
				<Paper sx={{ width: '100%', mb: 2 }}>
					<EnhancedTableToolbar
						numSelected={selected.length}
						title='Konten Youtube'
						onView={() => viewYoutube(Number(selected[0]))}
						onEdit={() => console.log()}
						onDelete={() => console.log('first')}
						onCreate={() => console.log('first')} />
					{loading && (<LinearProgress />)}
					<TableContainer>
						<Table
							sx={{ minWidth: 750 }}
							aria-labelledby="tableTitle"
							size='medium'
						>
							<EnhancedTableHead
								numSelected={selected.length}
								order={order}
								orderBy={orderBy}
								onSelectAllClick={handleSelectAllClick}
								onRequestSort={handleRequestSort}
								rowCount={yt.length}
								headCells={headCells}
							/>
							<TableBody>
								{stableSort(yt, getComparator(order, orderBy))
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row, index) => {
										const isItemSelected = isSelected(row.id.toString());
										const labelId = `enhanced-table-checkbox-${index}`;

										return (
											<TableRow
												hover
												onClick={(event) => handleClick(event, row.id.toString())}
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
													{row.index + 1}
												</TableCell>
												<TableCell align="left">{row.title}</TableCell>
												<TableCell align="left">
													<Link href={row.url} target='_blank'>
														{row.url}
													</Link>
												</TableCell>
												{/* <TableCell align="left">{row.level}</TableCell> */}
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
						count={yt.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Paper>
				<CustomizedDialogs
					dialogOpen={dialogOpen}
					onDialogClose={handleCloseDialog}
					title={'Preview'}
					content={
						<>
							{selected.length == 1 && (
								<>
									<YoutubeIframe 
										videoId={yt.filter(val => val.id == Number(selected[0]))[0].youtube_id} 
										title={yt.filter(val => val.id == Number(selected[0]))[0].title} 
									/>
									<Typography component='div' sx={{ textAlign: 'center', my: 1, }}>
										{yt.filter(val => val.id == Number(selected[0]))[0].title}
									</Typography>
								</>
							)}
						</>
					} />
			</Box>
		</>
	);
};

export default Youtubes;

interface Yt extends Pick<IYoutube, 'title' | 'description' | 'url' | 'thumbnail'>{
      index: number;
      id: number;
      youtube_id: string;
}

const headCells: HeadCell[] = [
	{
		id: 'id',
		numeric: false,
		disablePadding: true,
		label: 'Index',
	},
	{
		id: 'title',
		numeric: false,
		disablePadding: false,
		label: 'Judul',
	},
	{
		id: 'link',
		numeric: false,
		disablePadding: false,
		label: 'Link',
	},
];