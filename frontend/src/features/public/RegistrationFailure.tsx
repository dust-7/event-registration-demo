import { Button, Typography } from '@mui/material';

interface RegistrationFailureProps {
  errors: string[];
  onRestart: () => void;
}

export default function RegistrationFailure({ errors, onRestart }: RegistrationFailureProps) {
  return (
    <>
      <Typography sx={{ mt: 3, color: 'error.main', fontWeight: 'bold', fontSize: '1.1rem' }}>
        Error
      </Typography>
      {errors.map((detail, i) => (
        <Typography key={i} sx={{ color: 'error.main', mt: 0.5 }}>
          - {detail}
        </Typography>
      ))}
      <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={onRestart}>
        Try again
      </Button>
    </>
  );
}
