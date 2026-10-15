import { Typography } from '@mui/material';
import type { PublicEventDto } from '../../services/eventService';

interface Props {
  event: PublicEventDto;
}

export default function EventInfoCard({ event }: Props) {
  return (
    <>
      <Typography sx={{ mt: 2, color: 'grey.500', fontWeight: 'bold', fontSize: '0.8rem' }}>Name</Typography>
      <Typography sx={{ mb: 1 }}>{event.name}</Typography>
      <Typography sx={{ color: 'grey.500', fontWeight: 'bold', fontSize: '0.8rem' }}>Date & Time</Typography>
      <Typography sx={{ mb: 1 }}>{event.dateTime}</Typography>
      <Typography sx={{ color: 'grey.500', fontWeight: 'bold', fontSize: '0.8rem' }}>Address</Typography>
      <Typography sx={{ mb: 1 }}>{event.address}</Typography>
      <Typography sx={{ color: 'grey.500', fontWeight: 'bold', fontSize: '0.8rem' }}>Registration Deadline</Typography>
      <Typography>{event.deadline}</Typography>
    </>
  );
}
