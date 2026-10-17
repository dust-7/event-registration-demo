import { Alert, AlertTitle, Button } from '@mui/material';

interface RegistrationFailureProps {
  errors: string[];
  onRestart: () => void;
}

export default function RegistrationFailure({ errors, onRestart }: RegistrationFailureProps) {
  return (
    <>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        <ul>
          {errors.map((detail, i) => (
            <li key={i}>{detail}</li>
          ))}
        </ul>
      </Alert>
      <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={onRestart}>
        Go back
      </Button>
    </>
  );
}
