import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import React from 'react'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}))

const BootstrapDialogTitle = (props: DialogTitleProps) => {
	const { children, onClose, ...other } = props

	return (
		<DialogTitle sx={{ m: 0, p: 2 }} {...other}>
			{children}
			{onClose ? (
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</DialogTitle>
	)
}

export default function CustomizedDialogs(props: Props) {
	const { dialogOpen, onDialogClose, content, title, actionButton } = props

	return (
		<>
			<BootstrapDialog
				onClose={onDialogClose}
				aria-labelledby="customized-dialog-title"
				open={dialogOpen}
			>
				<BootstrapDialogTitle id="customized-dialog-title" onClose={onDialogClose}>
					{title}
				</BootstrapDialogTitle>
				<DialogContent dividers>
					{content}
				</DialogContent>
				{actionButton && (
					<DialogActions>
						{actionButton}
					</DialogActions>
				)}
			</BootstrapDialog>
		</>
	)
}

interface Props {
      dialogOpen: boolean;
      onDialogClose: () => void;
      title: string;
      content: JSX.Element;
      actionButton?: JSX.Element;
}

export interface DialogTitleProps {
      id: string;
      children?: React.ReactNode;
      onClose: () => void;
}