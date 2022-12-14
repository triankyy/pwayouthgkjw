/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Box,
	Checkbox,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TablePagination,
	TableRow,
	LinearProgress,
	Typography,
	IconButton,
	Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../app/store';
import { EnhancedTableHead, EnhancedTableToolbar, getComparator, HeadCell, Order, stableSort } from '../../../components/DataTable';
import { UserInterface } from '../../../interfaces/user.interface';
import { useGetAllQuery } from '../../../services/users.service';
import _ from 'lodash';

const Users = () => {
	const { data, error, isLoading, isFetching, isSuccess } = useGetAllQuery();
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof UserInterface>('id');
	const [selected, setSelected] = React.useState<readonly string[]>([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const user = useSelector((state: RootState) => state.user);
	const navigate = useNavigate();


	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof UserInterface,
	): void => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>): void => {
		if (event.target.checked) {
			const newSelected = isSuccess ? data.map((n) => n.id.toString()) : [];
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
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (isSuccess ? data.length : 0)) : 0;

	return (
		<>
			<Box width='100%'>
				<Paper sx={{ width: '100%', mb: 2 }}>
					<EnhancedTableToolbar 
						numSelected={selected.length} 
						title='Users Data'
						disableDelete={selected.length > 1 || Number(selected[0]) != user.uid}
						onDelete={() => console.log('first')} 
						onCreate={() => console.log('first')} />
					{isLoading && <LinearProgress  />}
					<TableContainer style={{height: '65vh'}}>
						{isLoading ? <Typography sx={{textAlign: 'center', marginTop: 2}}>Loading...</Typography> : 
							<>
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
										rowCount={isSuccess ? data.length : 0}
										headCells={headCells}
									/>
									<TableBody>
										{/* {isSuccess && stableSort(, getComparator(order, orderBy)) */}
										{isSuccess && data
											.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
											.map((row, index) => {
												const isItemSelected = isSelected(row.id.toString());
												const labelId = `enhanced-table-checkbox-${index}`;
												return (
													<TableRow
														hover
														role="checkbox"
														aria-checked={isItemSelected}
														tabIndex={-1}
														key={row.id}
														selected={isItemSelected}
													>
														<TableCell padding="checkbox">
															<Checkbox
																onClick={(event) => handleClick(event, row.id.toString())}
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
															{index + 1}
														</TableCell>
														<TableCell align="left">{row.email}</TableCell>
														<TableCell align="left">{row.name}</TableCell>
														<TableCell align="left">{row.roles.map(({name}) => name)}</TableCell>
														<TableCell align="left">
															<Tooltip title="Edit">
																<IconButton
																	onClick={() => navigate(`edit/${row.id.toString()}`)}
																>
																	<EditIcon />
																</IconButton>
															</Tooltip>
														</TableCell>
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
							</>
						}
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={isSuccess ? data.length : 0}
						rowsPerPage={10}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Paper>
			</Box>
		</>
	);
};

export default Users;

const headCells: HeadCell[] = [
	{
		id: 'id',
		numeric: false,
		disablePadding: true,
		label: 'Index',
	},
	{
		id: 'email',
		numeric: false,
		disablePadding: false,
		label: 'Email',
	},
	{
		id: 'name',
		numeric: false,
		disablePadding: false,
		label: 'Name',
	},
	{
		id: 'role',
		numeric: false,
		disablePadding: false,
		label: 'Roles',
	},
	{
		id: 'action',
		numeric: false,
		disablePadding: false,
		label: 'Aksi',
	}
];