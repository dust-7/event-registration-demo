import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function RootLayout() {
  const location = useLocation();

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          <Typography variant="h6" component="a" href="/" sx={{ textDecoration: 'none', color: 'grey.900', fontWeight: 'bold' }}>
            Event Company
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {location.pathname !== '/admin' && (
            <Button component={Link} to="/admin" variant="contained" color="warning">Admin</Button>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}
