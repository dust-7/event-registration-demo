import { LinearProgress, MenuItem, Select, Typography } from '@mui/material';
import type { PublicEventDto } from '../../services/eventService';

interface Props {
  events: PublicEventDto[];
  loading: boolean;
  error: boolean;
  selectedUuid: string;
  onEventChange: (uuid: string, event: PublicEventDto | null) => void;
}

export default function EventSelector({ events, loading, error, selectedUuid, onEventChange }: Props) {
  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ color: 'grey.700', fontWeight: 'bold' }}>
        Select an Event
      </Typography>
      {loading && <LinearProgress sx={{ mt: 2 }} />}
      {error && (
        <Typography sx={{ mt: 2, color: 'error.main', fontWeight: 'bold' }}>
          Could not fetch events, try again later.
        </Typography>
      )}
      {!loading && !error && (
        <Select
          value={selectedUuid}
          onChange={(e) => {
            const uuid = e.target.value as string;
            const evt = events.find((ev) => ev.uuid === uuid) || null;
            onEventChange(uuid, evt);
          }}
          displayEmpty
          sx={{ mt: 2, width: '100%' }}
        >
          <MenuItem value="">-- Choose an event --</MenuItem>
          {events.map((evt) => (
            <MenuItem key={evt.uuid} value={evt.uuid}>
              {evt.name}
            </MenuItem>
          ))}
        </Select>
      )}
    </>
  );
}
