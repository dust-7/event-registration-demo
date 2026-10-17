import { useState } from 'react';
import { Box, TextField, FormControlLabel, Checkbox, Button } from '@mui/material';
import AddEventDialog from './AddEventDialog';

interface EventSearchBarProps {
  onSearchChange: (value: string) => void;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export default function EventSearchBar({
  onSearchChange,
  open,
  onOpenChange,
}: EventSearchBarProps) {
  const [value, setValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearchChange(newValue);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, flexWrap: 'nowrap' }}>
        <TextField
          sx={{ flexGrow: 1 }}
          placeholder="Search events by name, address, or handler..."
          variant="outlined"
          size="small"
          type="search"
          value={value}
          onChange={handleChange}
        />
        <FormControlLabel
          control={<Checkbox checked={open} onChange={(e) => onOpenChange(e.target.checked)} />}
          label="Open Events Only"
        />
        <Button variant="contained" onClick={() => setShowAddDialog(true)}>
          Add Event
        </Button>
      </Box>
      <AddEventDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} />
    </>
  );
}
