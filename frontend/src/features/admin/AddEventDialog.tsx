import { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormHelperText,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
  Button,
  LinearProgress,
} from '@mui/material';
import { employeeService } from '../../services/employeeService';
import type { Employee } from '../../services/employeeService';
import { eventService } from '../../services/eventService';
import CloseIcon from '@mui/icons-material/Close';
import dayjs, { type Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface AddEventDialogProps {
  open: boolean;
  onClose: () => void;
}

const eventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dateTime: z.instanceof(dayjs as unknown as typeof Dayjs, { message: 'Event date/time is required' }).refine(d => d.isValid(), { message: 'Event date/time is required' }).refine(d => d.isAfter(dayjs()), {
    message: 'Event date/time must be in the future',
    path: ['dateTime'],
  }),
  postalCode: z.string().regex(/^\d{6}$/, 'Postal code must be 6 digits'),
  deadline: z.instanceof(dayjs as unknown as typeof Dayjs, { message: 'Registration deadline is required' }).refine(d => d.isValid(), { message: 'Registration deadline is required' }),
  capacity: z.coerce.number().int().positive('Capacity must be a positive integer'),
  handlerUuid: z.string().min(1, 'Handler is required'),
}).refine(data => {
  const today = dayjs().startOf('day');
  return data.deadline.isAfter(today.subtract(1, 'day')) && data.deadline.isBefore(data.dateTime.add(1, 'day'));
}, {
  message: 'Deadline must be between today and event date',
  path: ['deadline'],
}).refine(data => {
  return data.dateTime.isAfter(data.deadline);
}, {
  message: 'Registration deadline must be on or before event date',
  path: ['deadline'],
});

export default function AddEventDialog({ open, onClose }: AddEventDialogProps) {
  const [name, setName] = useState('');
  const [dateTime, setDateTime] = useState<dayjs.Dayjs | null>(null);
  const [postalCode, setPostalCode] = useState('');
  const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(null);
  const [capacity, setCapacity] = useState('');
  const [handlerUuid, setHandlerUuid] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>('');
  const [apiDetails, setApiDetails] = useState<string[]>([]);

  const resetForm = () => {
    setName('');
    setDateTime(null);
    setPostalCode('');
    setDeadline(null);
    setCapacity('');
    setHandlerUuid('');
  };

  const handleClose = () => {
    resetForm();
    setHasAttemptedSubmit(false);
    setValidationErrors({});
    setApiError('');
    setApiDetails([]);
    onClose();
  };

  const getErrorForField = (fieldName: string): string | undefined => {
    if (!hasAttemptedSubmit) return undefined;
    return validationErrors[fieldName];
  };

  const handleAddEvent = async () => {
    setHasAttemptedSubmit(true);
    setApiError('');
    setApiDetails([]);

    const result = eventSchema.safeParse({
      name,
      dateTime,
      postalCode,
      deadline,
      capacity,
      handlerUuid,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach(err => {
        const field = err.path[0];
        if (field !== undefined) {
          errors[String(field)] = err.message ?? 'Invalid value';
        }
      });
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    const { success, error: apiErr, details } = await eventService.createEvent({
      name: result.data.name,
      dateTime: result.data.dateTime.toISOString(),
      postalCode: result.data.postalCode,
      deadline: result.data.deadline.format('YYYY-MM-DD'),
      capacity: result.data.capacity,
      handlerUuid: result.data.handlerUuid,
    });

    setIsSubmitting(false);

    if (success) {
      window.location.reload();
    } else {
      setApiError(apiErr ?? 'Failed to create event');
      if (details) {
        setApiDetails(details);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    employeeService.listEmployees().then((res) => {
      if (res.success) {
        setEmployees(res.data ?? []);
      } else {
        setError(true);
      }
      setLoading(false);
    });
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Add New Event
          <IconButton onClick={handleClose} edge="end" sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              error={!!getErrorForField('name')}
              helperText={getErrorForField('name')}
            />

            <DateTimePicker
              label="Event Date Time"
              value={dateTime}
              onChange={(newValue) => setDateTime(newValue)}
              slotProps={{
                textField: { fullWidth: true, required: true, error: !!getErrorForField('dateTime'), helperText: getErrorForField('dateTime') },
              }}
            />

            <TextField
              label="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              fullWidth
              required
              slotProps={{ htmlInput: { inputMode: 'numeric', pattern: '[0-9]{6}', maxLength: 6 } }}
              error={!!getErrorForField('postalCode')}
              helperText={getErrorForField('postalCode')}
            />

            <DatePicker
              label="Registration Deadline"
              value={deadline}
              onChange={(newValue) => setDeadline(newValue)}
              minDate={dayjs()}
              slotProps={{
                textField: { fullWidth: true, required: true, error: !!getErrorForField('deadline'), helperText: getErrorForField('deadline') },
              }}
            />

            <TextField
              label="Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              fullWidth
              required
              slotProps={{ htmlInput: { inputMode: 'numeric', pattern: '[0-9]*' } }}
              error={!!getErrorForField('capacity')}
              helperText={getErrorForField('capacity')}
            />

            {loading && <LinearProgress sx={{ mt: 2 }} />}
            {error && (
              <Alert severity="error">Could not fetch employees list, try again later.</Alert>
            )}
            {!loading && !error && (
              <FormControl fullWidth required error={!!getErrorForField('handlerUuid')}>
                <InputLabel id="handler-select-label">Handler</InputLabel>
                <Select
                  labelId="handler-select-label"
                  value={handlerUuid}
                  label="Handler"
                  onChange={(e) => setHandlerUuid(e.target.value)}
                >
                  <MenuItem value="">
                    Select a handler
                  </MenuItem>
                  {employees.map((emp) => (
                    <MenuItem key={emp.uuid} value={emp.uuid}>
                      {emp.name}
                    </MenuItem>
                  ))}
                </Select>
                {!!getErrorForField('handlerUuid') && (
                  <FormHelperText>{getErrorForField('handlerUuid')}</FormHelperText>
                )}
              </FormControl>
            )}
          </Box>
        </DialogContent>
        {apiError && (
          <>
            <Divider />
            <DialogContent>
              <Alert severity="error">
                <AlertTitle>{apiError}</AlertTitle>
                <ul>
                  {apiDetails.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </Alert>
            </DialogContent>
          </>
        )}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddEvent} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
