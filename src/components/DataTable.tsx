/* eslint-disable @typescript-eslint/no-explicit-any */
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { alpha, Box, Checkbox, IconButton, TableCell, TableHead, TableRow, TableSortLabel, Toolbar, Tooltip, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React from 'react';

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

export function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key,
): (
	a: { [key in Key]: number | string },
	b: { [key in Key]: number | string },
) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number): T[] {
	const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

export function EnhancedTableHead(props: EnhancedTableProps): JSX.Element {
	const {
		onSelectAllClick,
		order,
		orderBy,
		numSelected,
		rowCount,
		onRequestSort,
		headCells
	} = props;
	const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => { onRequestSort(event, property); };

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric === 'center' ? 'center' : headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps): JSX.Element {
	const { numSelected, title, onEdit, onView, onDelete, onCreate, disableView, disableEdit, disableDelete, disableCreate } = props;

	return (
		<>
			<Toolbar
				sx={{
					pl: { sm: 2 },
					pr: { xs: 1, sm: 1 },
					...(numSelected > 0 && {
						bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
					}),
				}}
			>
				{numSelected > 0 ? (
					<Typography
						sx={{ flex: '1 1 100%' }}
						color="inherit"
						variant="subtitle1"
						component="div"
					>
						{numSelected} selected
					</Typography>
				) : (
					<Typography
						sx={{ flex: '1 1 100%' }}
						variant="h6"
						id="tableTitle"
						component="div"
					>
						{title}
					</Typography>
				)}
				{numSelected > 0 ? (
					<>
						{disableView || (
							<Tooltip title='Preview Data'>
								<span>
									<IconButton disabled={numSelected > 1} onClick={() => onView && onView()}>
										<VisibilityIcon />
									</IconButton>
								</span>
							</Tooltip>
						)}
						{disableEdit || (
							<Tooltip title='Edit Data'>
								<span>
									<IconButton disabled={numSelected > 1} onClick={() => onEdit && onEdit()}>
										<EditIcon />
									</IconButton>
								</span>
							</Tooltip>
						)}
						{disableDelete || (
							<Tooltip title='Delete Data'>
								<IconButton onClick={() => onDelete && onDelete()}>
									<DeleteIcon />
								</IconButton>
							</Tooltip>
						)}
					</>
				) : (
					<>
						{disableCreate || (
							<Tooltip title='Add Data'>
								<IconButton onClick={() => onCreate && onCreate()}>
									<AddIcon />
								</IconButton>
							</Tooltip>
						)}
					</>
				)}
			</Toolbar>
		</>
	);
}

export interface HeadCell {
	disablePadding: boolean;
	id: any;
	label: string;
	numeric: boolean | 'center';
}

export type Order = 'asc' | 'desc';

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
	headCells: HeadCell[]
}

interface EnhancedTableToolbarProps {
	numSelected: number;
	title: string;
	onView?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
	onCreate?: () => void;
	disableView?: boolean
	disableEdit?: boolean
	disableDelete?: boolean
	disableCreate?: boolean
}