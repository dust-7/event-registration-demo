import { useCallback, useEffect, useState } from 'react';
import { Container, Divider, Paper } from '@mui/material';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import type { PublicEventDto } from '../../services/eventService';
import EventSelector from './EventSelector';
import EventInfoCard from './EventInfoCard';
import RegistrationForm from './RegistrationForm';
import RegistrationSuccess from './RegistrationSuccess';
import RegistrationFailure from './RegistrationFailure';

export default function PublicPage() {
  const [events, setEvents] = useState<PublicEventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<PublicEventDto | null>(null);
  const [email, setEmail] = useState('');
  const [registering, setRegistering] = useState(false);
  const [registerResult, setRegisterResult] = useState<{ kind: 'success' | 'error'; registrationNo?: string; details?: string[] } | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(false);
    const result = await eventService.listPublicEvents();
    if (result.success && result.data) {
      setEvents(result.data);
    } else {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRegister = useCallback(async () => {
    setRegistering(true);
    const regResult = await registrationService.register({
      eventUuid: selectedUuid,
      emailAddress: email.trim(),
    });
    setRegistering(false);

    if (regResult.success && regResult.data) {
      setRegisterResult({ kind: 'success', registrationNo: regResult.data.registrationNo });
    } else {
      setRegisterResult({
        kind: 'error',
        details: regResult.details && regResult.details.length > 0
          ? regResult.details
          : ['Could not process registration, try again later.'],
      });
    }
  }, [email, selectedUuid]);

  const handleEventChange = useCallback((uuid: string, event: PublicEventDto | null) => {
    setSelectedUuid(uuid);
    setSelectedEvent(event);
    setRegisterResult(null);
  }, []);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
  }, []);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, mt: 3 }}>
        {registerResult?.kind === 'success' && (
          <RegistrationSuccess eventName={selectedEvent?.name ?? ''} registrationNo={registerResult.registrationNo!} onRestart={handleReload} />
        )}
        {registerResult?.kind === 'error' && (
          <RegistrationFailure errors={registerResult.details!} onRestart={handleReload} />
        )}
        {!registerResult && (
          <>
            <EventSelector
              events={events}
              loading={loading}
              error={error}
              selectedUuid={selectedUuid}
              onEventChange={handleEventChange}
            />
            {selectedEvent && (
              <>
                <Divider sx={{ mt: 3 }} />
                <EventInfoCard event={selectedEvent} />
                <Divider sx={{ mt: 3 }} />
                <RegistrationForm
                  key={selectedEvent.uuid}
                  email={email}
                  onEmailChange={handleEmailChange}
                  onRegister={onRegister}
                  disabled={registering || !selectedUuid}
                />
              </>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}
