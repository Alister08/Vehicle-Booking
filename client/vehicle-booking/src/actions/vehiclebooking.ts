// src/actions/bookingActions.ts
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { api } from "./api";

// import { FormValues } from '@/components/VehicleBookingForm'

/**
 * Sends the booking payload to your API and shows a toast.
 */
export async function createBooking(data:any) {
  try {
    const res = await api.post('/booking/create-booking', data)
    toast.success('🎉 Booking confirmed!')
    return res.data
  } catch (err: any) {
    toast.error(err.response?.data?.message || '❌ Booking failed')
    throw err
  }
}
