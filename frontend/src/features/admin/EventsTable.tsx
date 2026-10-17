import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Chip,
  Button,
  TablePagination,
} from '@mui/material';
import type { AdminEventDto } from '../../services/eventService';
import { useState } from 'react';
import ViewTrendDialog from './ViewTrendDialog';

interface EventsTableProps {
  events: AdminEventDto[];
  total: number;
  page: number;
  onPageChange: (newPage: number) => void;
}

function isEventOpen(event: AdminEventDto): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(event.deadline);
  deadline.setHours(0, 0, 0, 0);
  return event.registrationCount < event.capacity && deadline >= today;
}

export default function EventsTable({
  events,
  total,
  page,
  onPageChange,
}: EventsTableProps) {
  const [viewTrendOpen, setViewTrendOpen] = useState(false);
  const [selectedEventUuid, setSelectedEventUuid] = useState('');
  const [selectedEventName, setSelectedEventName] = useState('');

  const handleViewTrend = (uuid: string, name: string) => {
    setSelectedEventUuid(uuid);
    setSelectedEventName(name);
    setViewTrendOpen(true);
  };

  const handleCloseViewTrend = () => {
    setViewTrendOpen(false);
  };
  return (
    <TableContainer component={Paper} sx={{ mt: 3, width: '100%' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ '& .MuiTableCell-head': { backgroundColor: '#ddd' } }}>
            <TableCell>NAME</TableCell>
            <TableCell>CREATED ON</TableCell>
            <TableCell>EVENT DATE TIME</TableCell>
            <TableCell>ADDRESS</TableCell>
            <TableCell>REGISTRATION DEADLINE</TableCell>
            <TableCell>HANDLER</TableCell>
            <TableCell>CAPACITY</TableCell>
            <TableCell>NO. OF REGISTRATION</TableCell>
            <TableCell>STATUS</TableCell>
            <TableCell>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} sx={{ textAlign: 'center', py: 4 }}>
                No events found
              </TableCell>
            </TableRow>
          ) : (
            events.map((evt) => {
              const open = isEventOpen(evt);
              return (
                <TableRow
                  key={evt.uuid}
                  hover
                >
                  <TableCell>{evt.name}</TableCell>
                  <TableCell>{evt.createdAt}</TableCell>
                  <TableCell sx={{ whiteSpace: 'pre-line'}}>{evt.dateTime}</TableCell>
                  <TableCell>{evt.address}</TableCell>
                  <TableCell>{evt.deadline}</TableCell>
                  <TableCell>{evt.handler.name}</TableCell>
                  <TableCell>{evt.capacity}</TableCell>
                  <TableCell>{evt.registrationCount}</TableCell>
                  <TableCell>
                    <Chip
                      label={open ? 'Open' : 'Closed'}
                      size="small"
                      sx={{
                        backgroundColor: open ? 'success.light' : 'grey.300',
                        color: open ? 'primary.contrastText' : 'grey.800',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleViewTrend(evt.uuid, evt.name)}
                    >
                      View Trend
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[]}
              colSpan={10}
              count={total}
              rowsPerPage={10}
              page={page}
              onPageChange={(_, newPage) => onPageChange(newPage)}
              onRowsPerPageChange={() => {}}
            />
          </TableRow>
        </TableFooter>
      </Table>
      <ViewTrendDialog
        open={viewTrendOpen}
        onClose={handleCloseViewTrend}
        eventUuid={selectedEventUuid}
        eventName={selectedEventName}
      />
    </TableContainer>
  );
}
