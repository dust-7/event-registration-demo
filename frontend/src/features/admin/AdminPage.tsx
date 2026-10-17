import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Box, Container, Typography, CircularProgress } from '@mui/material';
import EventSearchBar from './EventSearchBar';
import EventsTable from './EventsTable';
import { eventService } from '../../services/eventService';
import type { AdminEventDto } from '../../services/eventService';

export default function AdminPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<AdminEventDto[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await eventService.listAdminEvents({ page, search: search || undefined, open });
    if (result.success && result.data) {
      setEvents(result.data.events);
      setTotal(result.data.total);
    } else {
      setError(result.error || 'Failed to load events');
    }
    setLoading(false);
  }, [page, search, open]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearchChange = (value: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSearch(value);
      setPage(0);
    }, 1000);
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 8 }}>
      <Typography variant="h4">Events</Typography>
      <EventSearchBar
        onSearchChange={handleSearchChange}
        open={open}
        onOpenChange={handleOpenChange}
      />
      {error ? (
        <Alert severity="error">Could not fetch events list, try again later.</Alert>
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
          <EventsTable
            events={events}
            total={total}
            page={page}
            onPageChange={setPage}
          />
        </Box>
      )}
    </Container>
  );
}
