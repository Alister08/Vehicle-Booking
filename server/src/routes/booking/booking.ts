// src/routes/booking/booking.ts
import { Router, Request, Response } from 'express'
import prisma from '../../lib/prisma'

const bookingRouter = Router()

bookingRouter.post(
  '/create-booking',
  async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, vehicleId, startDate, endDate } = req.body
    if (!firstName || !lastName || !vehicleId || !startDate || !endDate) {
      res.status(400).json({ message: 'Missing required fields' })
      return
    }

    try {
      // find or create user
      let user = await prisma.user.findFirst({ where: { firstName, lastName } })
      if (!user) {
        user = await prisma.user.create({ data: { firstName, lastName } })
      }

      // check for overlap
      const overlapping = await prisma.booking.findFirst({
        where: {
          vehicleId: Number(vehicleId),
          AND: [
            { startDate: { lte: new Date(endDate) } },
            { endDate:   { gte: new Date(startDate) } },
          ],
        },
      })
      if (overlapping) {
        res
          .status(400)
          .json({ message: 'This vehicle is already booked for those dates.' })
        return
      }

      // create booking
      const booking = await prisma.booking.create({
        data: {
          userId:    user.id,
          vehicleId: Number(vehicleId),
          startDate: new Date(startDate),
          endDate:   new Date(endDate),
        },
      })

      res.status(201).json({ booking })
    } catch (error) {
      console.error('Error creating booking:', error)
      res.status(500).json({ message: 'Error creating booking' })
    }
  }
)

export default bookingRouter
