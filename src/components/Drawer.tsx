import { Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

interface Props {
      window?: () => Window;
      navItems: Array<string>;
      handleDrawerToggle: React.MouseEventHandler<HTMLDivElement> | undefined;
      mobileOpen: boolean;
}

const drawerWidth = 240;

export default function CustomDrawer(props: Props) {
	const { window, navItems, handleDrawerToggle, mobileOpen } = props;
	const container = window !== undefined ? () => window().document.body : undefined;
	const drawer = (
		<Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
			<Typography variant="h6" sx={{ my: 2 }}>
                        Youth Segaran Dlanggu
			</Typography>
			<Divider />
			<List>
				{navItems.map((item) => (
					<ListItem key={item} disablePadding>
						<ListItemButton sx={{ textAlign: 'center' }}>
							<ListItemText primary={item} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);
	return (
		<Box component="nav">
			<Drawer
				container={container}
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					display: { xs: 'block', sm: 'none' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
			>
				{drawer}
			</Drawer>
		</Box>
	);
}