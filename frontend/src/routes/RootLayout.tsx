import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

export default function RootLayout() {
  return (
    <Box sx={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
      <Outlet />
    </Box>
  );
}
