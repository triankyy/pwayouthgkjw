import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import CustomDrawer from './Drawer';
// import Logo from "../assets/logoGKJWSegaranDlanggu.svg";


interface Props {
      handleDrawerToggle: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement> | undefined;
      mobileOpen: boolean;
}

const navItems = ['Tentang', 'Konten', 'Jadwal Pelayan'];

export default function DrawerAppBar(props: Props) {
      const { handleDrawerToggle, mobileOpen } = props;
      
      return (
            <>
                  <AppBar component="nav" sx={{ bgcolor: '#1E1E1E'}}>
                        <Toolbar>
                              <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ mr: 2, display: { sm: 'none' } }}
                              >
                                    <MenuIcon />
                              </IconButton>
                              <img src={require('../assets/logoGKJWSegaranDlanggu.png')} alt="" width={50} />
                              <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{ marginX: 2, flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                              >
                                    Youth Segaran Dlanggu
                              </Typography>
                              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    {navItems.map((item) => (
                                          <Button key={item} sx={{ color: '#fff' }}>
                                                {item}
                                          </Button>
                                    ))}
                              </Box>
                        </Toolbar>
                  </AppBar>
                  <CustomDrawer navItems={navItems} handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} />
            </>
      );
}