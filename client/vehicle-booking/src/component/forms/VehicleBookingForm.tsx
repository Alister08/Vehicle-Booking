'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs }          from '@mui/x-date-pickers/AdapterDayjs';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver }          from '@hookform/resolvers/zod';
import * as z                   from 'zod';
import dayjs                    from 'dayjs';

import { createBooking }        from '@/actions/vehiclebooking';
import { fetchVehicleTypes, fetchVehicles } from '@/actions/vehicleaction';
import { vehicleBookingSchema } from '@/lib/zod/vehiclebooking';

import DatePickerInput          from '../UI/DatePickerInput';
import InputField               from '../UI/InputField';

type FormValues = z.infer<typeof vehicleBookingSchema>;
type VehicleType = { id: number; name: string; wheelCount: number };
type Vehicle     = { id: number; modelName: string; typeId: number };

export default function VehicleBookingForm() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [step, setStep]         = useState(1);
  const [types, setTypes]       = useState<VehicleType[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const methods = useForm<FormValues>({
    resolver: zodResolver(vehicleBookingSchema),
    defaultValues: {
      firstName: '',
      lastName:  '',
      wheels:    '4',
      typeId:    '',
      vehicleId: '',
      startDate: '',
      endDate:   '',
    }
  });

  const {
    control,
    watch,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    formState: { errors, isSubmitting }
  } = methods;

  const wheels    = watch('wheels');
  const typeId    = watch('typeId');
  const vehicleId = watch('vehicleId');

  // load types when wheels chosen
  useEffect(() => {
    if (!wheels) {
      setTypes([]);
      return;
    }
    fetchVehicleTypes(wheels).then(setTypes).catch(console.error);
    setValue('typeId','');
    setValue('vehicleId','');
  }, [wheels, setValue]);

  // load vehicles when type chosen
  useEffect(() => {
    if (!typeId) {
      setVehicles([]);
      return;
    }
    fetchVehicles(typeId).then(setVehicles).catch(console.error);
    setValue('vehicleId','');
  }, [typeId, setValue]);

  // validate current step
  const validateStep = async () => {
    switch(step) {
      case 1: return trigger(['firstName','lastName']);
      case 2: return trigger('wheels');
      case 3: return trigger('typeId');
      case 4: return trigger('vehicleId');
      case 5: return trigger(['startDate','endDate']);
      default: return true;
    }
  };

  const onNext = async () => {
    if (await validateStep() && step < 6) {
      setStep(s => s + 1);
    }
  };
  const onBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
    }
  };

  const onSubmit = async (data: FormValues) => {
    await createBooking(data);
  };

  const values     = getValues();
  const chosenType = types.find(t => String(t.id) === values.typeId)?.name || '';
  const chosenModel= vehicles.find(v=>String(v.id)===values.vehicleId)?.modelName || '';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          mx: 'auto',
          p: 4,
          borderRadius: 2,
          backgroundColor: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px rgba(31,38,135,0.37)',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Vehicle Booking
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1 */}
            {step === 1 && (
              <Box mb={4}>
                <Typography variant="h6">What's your name?</Typography>
                <Grid container spacing={2}>
                  <Grid size={{xs:12, sm:6}}>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          {...field}
                          label="First Name"
                          required
                          errorMessage={errors.firstName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{xs:12, sm:6}}>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          {...field}
                          label="Last Name"
                          required
                          errorMessage={errors.lastName?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <Box mb={4}>
                <Typography variant="h6">Number of wheels</Typography>
                <Controller
                  name="wheels"
                  control={control}
                  render={({ field }) => (
                    <>
                      <RadioGroup {...field} row>
                        <FormControlLabel value="2" control={<Radio />} label="2" />
                        <FormControlLabel value="4" control={<Radio />} label="4" />
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

            {/* Step 3 */}
            {step === 3 && (
              <Box mb={4}>
                <Typography variant="h6">Type of vehicle</Typography>
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

            {/* Step 4 */}
            {step === 4 && (
              <Box mb={4}>
                <Typography variant="h6">Specific model</Typography>
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

            {/* Step 5 */}
            {step === 5 && (
              <Box mb={4}>
                <Typography variant="h6">Select date range</Typography>
                <Grid container spacing={2}>
                  <Grid size={{xs:12, sm:6}}>
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
                  <Grid size={{xs:12, sm:6}}>
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

          {/* Step 6: Summary */}
            {step === 6 && (
              <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                  Review Your Booking
                </Typography>

                {(() => {
                  const items = [
                    { label: 'First Name',  value: values.firstName },
                    { label: 'Last Name',   value: values.lastName  },
                    { label: 'Wheels',      value: values.wheels    },
                    { label: 'Type',        value: chosenType       },
                    { label: 'Model',       value: chosenModel      },
                    {
                      label: 'Start Date',
                      value: values.startDate
                        ? dayjs(values.startDate).format('YYYY-MM-DD')
                        : ''
                    },
                    {
                      label: 'End Date',
                      value: values.endDate
                        ? dayjs(values.endDate).format('YYYY-MM-DD')
                        : ''
                    },
                  ];
                  const rows: { label: string; value: string; }[][] = [];
                  for (let i = 0; i < items.length; i += 2) {
                    rows.push(items.slice(i, i + 2));
                  }
                  return rows.map((row, idx) => (
                    <Grid container spacing={2} mb={1} key={idx}>
                      {row.map(item => (
                        <Grid size={{xs:12, sm:6}}  key={item.label}>
                          <Typography
                            variant="subtitle2"
                            color="textSecondary"
                          >
                            {item.label}
                          </Typography>
                          <Typography>{item.value}</Typography>
                        </Grid>
                      ))}
                    </Grid>
                  ));
                })()}
              </Box>
            )}

            {/* Navigation */}
            <Box display="flex" justifyContent="space-between">
              <Button
                type="button"
  
                onClick={(e) => { e.preventDefault(); onBack(); }}
                disabled={step === 1 || isSubmitting}

                sx={{
                     backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    boxShadow: 'none',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.3)',
      boxShadow: 'none',
    },
                  }}
              >
                Back
                 
              </Button>

              {step < 6 ? (
                <Button
                  type="button"
            
                  onClick={(e) => { e.preventDefault(); onNext(); }}
                  disabled={isSubmitting}
                   sx={{
                     backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    boxShadow: 'none',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.3)',
      boxShadow: 'none',
    },
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
  
                  disabled={isSubmitting}
                  sx={{
                     backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    boxShadow: 'none',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.3)',
      boxShadow: 'none',
    },
                  }}
                >
                  Confirm
                </Button>
              )}
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </LocalizationProvider>
  );
}
