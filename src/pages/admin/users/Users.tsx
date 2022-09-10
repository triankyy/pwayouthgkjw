/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../app/store';
import { EnhancedTableHead, EnhancedTableToolbar, getComparator, HeadCell, Order, stableSort } from '../../../components/DataTable';
import toastSwal from '../../../components/swal/toastSwal';
import { getAllUser } from '../../../utils/apiConstants';

const Users = () => {
	const [users, setUsers] = React.useState<Array<UserData>>([]);
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof UserData>('index');
	const [selected, setSelected] = React.useState<readonly string[]>([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const user = useSelector((state: RootState) => state.user);
	const navigate = useNavigate();


	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof UserData,
	): void => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>): void => {
		if (event.target.checked) {
			const newSelected = users.map((n) => n.id);
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
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

	React.useEffect(() => {
		getUsers();
	}, []);

	const getUsers = async (): Promise<void> => {
		await axios.get(getAllUser).then((res) => {
			const data: [] = res.data;
			setUsers([]);
			data.map((el: any, index: number) => {
				setUsers((prev) => [...prev, {
					index: index+1,
					email: el.email,
					name: el.name,
					level: el.level,
					id: el.id
				}]);
			});
		}).catch((err) => toastSwal({icon: 'error', title: err?.data?.message}));
	};

	return (
		<>
			<Box width='100%'>
				<Paper sx={{ width: '100%', mb: 2 }}>
					<EnhancedTableToolbar 
						numSelected={selected.length} 
						title='Users Data'
						disableEdit={selected.length > 1 || Number(selected[0]) != user.uid}
						disableDelete={selected.length > 1 || Number(selected[0]) != user.uid}
						onView={() => console.log('first')} 
						onEdit={() => navigate(`edit/${selected[0]}`)}
						onDelete={() => console.log('first')} 
						onCreate={() => console.log('first')} />
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
								rowCount={users.length}
								headCells={headCells}
							/>
							<TableBody>
								{stableSort(users, getComparator(order, orderBy))
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
												<TableCell align="left">{row.email}</TableCell>
												<TableCell align="left">{row.name}</TableCell>
												<TableCell align="left">{row.level}</TableCell>
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
						count={users.length}
						rowsPerPage={rowsPerPage}
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

interface UserData {
      index: number;
      email: string;
      name: string;
      level: string;
      id: string;
}

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
		id: 'level',
		numeric: false,
		disablePadding: false,
		label: 'Level',
	}
];