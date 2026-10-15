import { Box, Button, Stack, Typography } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

interface RegistrationSuccessProps {
  eventName: string;
  registrationNo: string;
  onRestart: () => void;
}

export default function RegistrationSuccess({ eventName, registrationNo, onRestart }: RegistrationSuccessProps) {
  return (
    <Stack sx={{ mt: 3, gap: 2, alignItems: 'center' }}>
      <CheckCircleOutlinedIcon sx={{ color: 'success.light', fontSize: 56 }} />
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        Thank You!
      </Typography>
      <Typography variant="body1">
        Your registration has been confirmed
      </Typography>
      <Box
        sx={{
          bgcolor: 'grey.100',
          borderRadius: 2,
          px: 8,
          py: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: 'grey.700' }}>
          Event
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {eventName}
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.700', mt: 4 }}>
          Registration Number
        </Typography>
        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          {registrationNo}
        </Typography>
      </Box>
      <Button variant="contained" onClick={onRestart}>
        Back to Events
      </Button>
    </Stack>
  );
}
