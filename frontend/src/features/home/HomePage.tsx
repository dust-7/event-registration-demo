import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Event Company
      </Typography>
      <Button variant="contained" size="large" onClick={() => navigate('/admin')}>
        Admin
      </Button>
    </Container>
  );
}
