'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, RadioGroup,
  FormControlLabel, Radio, Typography,
  useTheme, useMediaQuery
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import { createBooking } from '@/actions/vehiclebooking';
import { fetchVehicleTypes, fetchVehicles } from '@/actions/vehicleaction';
import dayjs from 'dayjs';

export type FormValues = {
  firstName: string;
  lastName:  string;
  wheels:    '2' | '4';
  typeId:    string;
  vehicleId: string;
  startDate: string;
  endDate:   string;
};

type VehicleType = { id: number; name: string; wheelCount: number };
type Vehicle      = { id: number; modelName: string; typeId: number };

export default function VehicleBookingForm() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [step, setStep]         = useState(1);
  const [types, setTypes]       = useState<VehicleType[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const methods = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName:  '',
      wheels:    '4',
      typeId:    '',
      vehicleId: '',
      startDate: '',
      endDate:   ''
    }
  });

  const { control, watch, handleSubmit, trigger, setValue } = methods;
  const wheels = watch('wheels');
  const typeId = watch('typeId');

  // 1) Fetch types when wheels changes
  useEffect(() => {
    if (!wheels) {
      setTypes([]);
      return;
    }

    fetchVehicleTypes(wheels)
      .then(setTypes)
      .catch(console.error);

    setValue('typeId', '');
    setValue('vehicleId', '');
  }, [wheels, setValue]);

  // 2) Fetch vehicles when type changes
  useEffect(() => {
    if (!typeId) {
      setVehicles([]);
      return;
    }

    fetchVehicles(typeId)
      .then(setVehicles)
      .catch(console.error);

    setValue('vehicleId', '');
  }, [typeId, setValue]);

  const validateStep = async () => {
    switch (step) {
      case 1: return trigger(['firstName', 'lastName']);
      case 2: return trigger('wheels');
      case 3: return trigger('typeId');
      case 4: return trigger('vehicleId');
      case 5: return trigger(['startDate', 'endDate']);
      default: return true;
    }
  };

  const onNext = async () => {
    if (await validateStep() && step < 5) {
      setStep(s => s + 1);
    }
  };
  const onBack = () => { if (step > 1) setStep(s => s - 1) };

  // 3) Submit calls our booking action
  const onSubmit = async (data: FormValues) => {
    try {
      await createBooking(data);
      // optionally reset form or navigate away
    } catch {
      // error toast already shown
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Step 1: Name */}
          {step === 1 && (
            <Box>
              <Typography variant="h6">What's your name?</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: 'First name required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: 'Last name required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
            </Box>
          )}

          {/* Step 2: Wheels */}
          {step === 2 && (
            <Box>
              <Typography variant="h6">Number of wheels</Typography>
              <Controller
                name="wheels"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="2" control={<Radio />} label="2" />
                    <FormControlLabel value="4" control={<Radio />} label="4" />
                  </RadioGroup>
                )}
              />
            </Box>
          )}

          {/* Step 3: Type */}
          {step === 3 && (
            <Box>
              <Typography variant="h6">Type of vehicle</Typography>
              <Controller
                name="typeId"
                control={control}
                rules={{ required: 'Select a type' }}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    {types.map(t => (
                      <FormControlLabel
                        key={t.id}
                        value={String(t.id)}
                        control={<Radio />}
                        label={t.name}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </Box>
          )}

          {/* Step 4: Model */}
          {step === 4 && (
            <Box>
              <Typography variant="h6">Specific model</Typography>
              <Controller
                name="vehicleId"
                control={control}
                rules={{ required: 'Select a model' }}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    {vehicles.map(v => (
                      <FormControlLabel
                        key={v.id}
                        value={String(v.id)}
                        control={<Radio />}
                        label={v.modelName}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </Box>
          )}

          {/* Step 5: Date Range */}
          {/* Step 5: Date Range */}
{step === 5 && (
  <Box>
    <Typography variant="h6">Select date range</Typography>
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      <Controller
        name="startDate"
        control={control}
        rules={{ required: 'Start date required' }}
        render={({ field }) => (
          <DatePicker
            label="Start"
            value={field.value ? dayjs(field.value) : null}
            onChange={val => field.onChange(val ? val.toISOString() : '')}
            renderInput={params => <TextField {...params} fullWidth />}
          />
        )}
      />
      <Controller
        name="endDate"
        control={control}
        rules={{ required: 'End date required' }}
        render={({ field }) => (
          <DatePicker
            label="End"
            value={field.value ? dayjs(field.value) : null}
            onChange={val => field.onChange(val ? val.toISOString() : '')}
            renderInput={params => <TextField {...params} fullWidth />}
          />
        )}
      />
    </Box>
  </Box>
)}


          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button disabled={step === 1} onClick={onBack}>Back</Button>
            {step < 5 ? (
              <Button variant="contained" onClick={onNext}>Next</Button>
            ) : (
              <Button variant="contained" type="submit">Submit</Button>
            )}
          </Box>
        </form>
      </FormProvider>
    </Box>
    </LocalizationProvider>
  );
}
