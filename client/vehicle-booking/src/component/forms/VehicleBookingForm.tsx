'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  FormHelperText,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dayjs from 'dayjs';

import { createBooking } from '@/actions/vehiclebooking';
import { fetchVehicleTypes, fetchVehicles } from '@/actions/vehicleaction';

import { vehicleBookingSchema } from '@/lib/zod/vehiclebooking';
import DatePickerInput from '../UI/DatePickerInput';
type FormValues = z.infer<typeof vehicleBookingSchema>;



type VehicleType = { id: number; name: string; wheelCount: number };
type Vehicle     = { id: number; modelName: string; typeId: number };

export default function VehicleBookingForm() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [step, setStep]         = useState(1);
  const [types, setTypes]       = useState<VehicleType[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const methods = useForm({
    resolver: zodResolver(vehicleBookingSchema),
    defaultValues: {
      firstName: '',
      lastName:  '',
      wheels:    '4' as '2' | '4',
      typeId:    '',
      vehicleId: '',
      startDate: '',
      endDate:   ''
    }
  });

  const {
    control,
    watch,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors, isSubmitting }
  } = methods;

  const wheels = watch('wheels');
  const typeId = watch('typeId');

  // Fetch types when wheels changes
  useEffect(() => {
    if (!wheels) return setTypes([]);
    fetchVehicleTypes(wheels)
      .then(setTypes)
      .catch(console.error);
    setValue('typeId', '');
    setValue('vehicleId', '');
  }, [wheels, setValue]);

  // Fetch vehicles when type changes
  useEffect(() => {
    if (!typeId) return setVehicles([]);
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
    if (await validateStep() && step < 5) setStep(s => s + 1);
  };
  const onBack = () => { if (step > 1) setStep(s => s - 1) };

  const onSubmit = async (data: FormValues) => {
    await createBooking(data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          mx: 'auto',
          p: 4,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Vehicle Booking
        </Typography>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Name */}
            {step === 1 && (
              <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                  What's your name?
                </Typography>
                <Grid container spacing={2}>
                  <Grid  size={{xs:12,sm:6}} >
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="First Name"
                          fullWidth
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                        />
                      )}
                    />
                  </Grid>
                   <Grid  size={{xs:12,sm:6}} >
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Last Name"
                          fullWidth
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Step 2: Wheels */}
            {step === 2 && (
              <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                  Number of wheels
                </Typography>
                <Controller
                  name="wheels"
                  control={control}
                  render={({ field }) => (
                    <>
                      <RadioGroup {...field} row>
                        <FormControlLabel
                          value="2"
                          control={<Radio />}
                          label="2"
                        />
                        <FormControlLabel
                          value="4"
                          control={<Radio />}
                          label="4"
                        />
                      </RadioGroup>
                      {errors.wheels && (
                        <FormHelperText error>
                          {errors.wheels.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </Box>
            )}

            {/* Step 3: Type */}
            {step === 3 && (
              <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                  Type of vehicle
                </Typography>
                <Controller
                  name="typeId"
                  control={control}
                  render={({ field }) => (
                    <>
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
                      {errors.typeId && (
                        <FormHelperText error>
                          {errors.typeId.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </Box>
            )}

            {/* Step 4: Model */}
            {step === 4 && (
              <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                  Specific model
                </Typography>
                <Controller
                  name="vehicleId"
                  control={control}
                  render={({ field }) => (
                    <>
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
                      {errors.vehicleId && (
                        <FormHelperText error>
                          {errors.vehicleId.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </Box>
            )}

            {/* Step 5: Date Range */}
            {step === 5 && (
              <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                  Select date range
                </Typography>
                <Grid container spacing={2}>
                <Grid  size={{xs:12,sm:6}} >
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                       <DatePickerInput
                                              label="Start"
                        value={field.value}
                       onChange={field.onChange}
                      error={!!errors.startDate}
                       helperText={errors.startDate?.message}
                     />
                      )}
                    />
                  </Grid>
        <Grid  size={{xs:12,sm:6}} >
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
              


                       <DatePickerInput
                                              label="End"
                        value={field.value}
                       onChange={field.onChange}
                      error={!!errors.endDate}
                       helperText={errors.endDate?.message}
                     />
                     )}
                     />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={onBack}
                disabled={step === 1 || isSubmitting}
              >
                Back
              </Button>
              {step < 5 ? (
                <Button
                  variant="contained"
                  onClick={onNext}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              )}
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </LocalizationProvider>
  );
}
