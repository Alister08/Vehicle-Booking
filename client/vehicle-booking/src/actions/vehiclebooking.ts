// src/actions/bookingActions.ts
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { api } from "./api";
import { vehicleBookingSchema } from '@/lib/zod/vehiclebooking';
import { z } from 'zod';


// import { FormValues } from '@/components/VehicleBookingForm'
type FormValues = z.infer<typeof vehicleBookingSchema>;


/**
 * Sends the booking payload to your API and shows a toast.
 */
export async function createBooking(data:FormValues) {
  try {
    const res = await api.post('/booking/create-booking', data)
    toast.success('🎉 Booking confirmed!');
    window.location.href = '/home';
    return res.data

  } catch (err: any) {
    toast.error(err.response?.data?.message || '❌ Booking failed')
    throw err
  }
}
