import {
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { registrationService } from '../../services/registrationService';
import type { RegistrationTrendEntry } from '../../services/registrationService';

interface ViewTrendDialogProps {
  open: boolean;
  onClose: () => void;
  eventUuid: string;
  eventName: string;
}

export default function ViewTrendDialog({ open, onClose, eventUuid, eventName }: ViewTrendDialogProps) {
  const [rows, setRows] = useState<RegistrationTrendEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setRows([]);
    setError(null);
    setLoading(true);

    const fetchTrend = async () => {
      const result = await registrationService.getRegistrationTrend(eventUuid);
      if (result.success && result.data) {
        setRows(result.data);
      } else {
        setError(result.error || 'Failed to load registration trend');
      }
      setLoading(false);
    };

    fetchTrend();
  }, [open, eventUuid]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          Registration Trend
          <Typography variant="subtitle1" sx={{ color: 'grey.600' }}>{eventName}</Typography>
        </Box>
        <IconButton onClick={handleClose} edge="end" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ mt: 2, position: 'relative' }}>
        {error ? (
          <Alert severity="error">Could not fetch registration trend, try again later.</Alert>
        ) : (
          <Box sx={{ position: 'relative' }}>
            {loading && (
              <Box sx={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.5)',
                zIndex: 1,
              }}>
                <CircularProgress />
              </Box>
            )}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& .MuiTableCell-head': { backgroundColor: '#ddd' } }}>
                    <TableCell>DATE</TableCell>
                    <TableCell>NEW REGISTRATION</TableCell>
                    <TableCell>TOTAL REGISTRATION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.newRegistrationCount}</TableCell>
                      <TableCell>{row.registrationCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
