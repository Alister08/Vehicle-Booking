import { z } from 'zod';

export const vehicleBookingSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  wheels: z.enum(['2', '4'], { required_error: 'Please select number of wheels' }),
  typeId: z.string().nonempty('Please select a vehicle type'),
  vehicleId: z.string().nonempty('Please select a specific model'),
  startDate: z.string().nonempty('Start date is required'),
  endDate: z.string().nonempty('End date is required'),
}).refine(
  (data) => new Date(data.startDate) <= new Date(data.endDate),
  {
    message: 'End date must be same or after start date',
    path: ['endDate'],
  }
);

export type VehicleBookingFormValues = z.infer<typeof vehicleBookingSchema>;
