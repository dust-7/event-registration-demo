import { useState } from 'react';
import { Box, Button, OutlinedInput, Typography } from '@mui/material';
import { z } from 'zod';

interface Props {
  email: string;
  onEmailChange: (value: string) => void;
  onRegister: () => void;
  disabled: boolean;
}

const emailSchema = z.object({
  email: z.email('Please enter a valid email address.'),
});

export default function RegistrationForm({ email, onEmailChange, onRegister, disabled }: Props) {
  const [hasAttempted, setHasAttempted] = useState(false);

  const handleRegister = () => {
    setHasAttempted(true);
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      return;
    }
    onRegister();
  };
  return (
    <>
      <Typography sx={{ mt: 2, color: 'grey.700', fontWeight: 'bold', fontSize: '0.8rem' }}>Email Address</Typography>
      <OutlinedInput
        sx={{ mt: 1 }}
        placeholder="Enter your email address"
        fullWidth
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        disabled={disabled}
      />
      <Box sx={{ minHeight: '1.5rem' }}>
        {hasAttempted && emailSchema.safeParse({ email }).error?.issues.map(issue => (
          <Typography key={issue.message} sx={{ color: 'error.main', fontSize: '0.85rem' }}>
            {issue.message}
          </Typography>
        ))}
      </Box>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleRegister}
        disabled={disabled}
      >
        {disabled ? 'Registering...' : 'Register'}
      </Button>
    </>
  );
}
