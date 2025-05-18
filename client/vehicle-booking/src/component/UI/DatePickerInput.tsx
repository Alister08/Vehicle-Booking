// src/components/DatePickerInput.tsx
'use client';
import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { TextField } from '@mui/material';

export interface DatePickerInputProps {
  label: string;
  value: string;
  onChange: (newIso: string) => void;
  error?: boolean;
  helperText?: string;
  minDateIso?: string;
}

/**
 * A DatePicker that works with ISO‐string values and disables past dates.
 */
export default function DatePickerInput({
  label,
  value,
  onChange,
  error,
  helperText,
    minDateIso,
}: DatePickerInputProps) {

  const minDate: Dayjs | undefined = minDateIso ? dayjs(minDateIso) : undefined;


  return (
    <DatePicker
      label={label}
      value={value ? dayjs(value) : null}
      onChange={(val: Dayjs | null) => onChange(val ? val.toISOString() : '')}
      disablePast
       minDate={minDate}
      slotProps={{
        textField: {
          fullWidth: true,
          error,
          helperText,
        },
      }}
    />
  );
}
