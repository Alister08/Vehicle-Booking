// src/routes/vehicleTypeRouter.ts
import { Router, Request, Response } from 'express'
import prisma from '../../lib/prisma'

const vehicleTypeRouter = Router()

// GET /api/vehicle-types?wheelCount=2|4
vehicleTypeRouter.get(
  '/vehicle-type',
  async (req: Request, res: Response): Promise<void> => {
    const wc = req.query.wheelCount as string
    if (!wc || !['2','4'].includes(wc)) {
      res.status(400).json({ message: 'wheelCount must be 2 or 4' })
      return
    }

    try {
      const types = await prisma.vehicleType.findMany({
        where: { wheelCount: Number(wc) },
      })
      res.json(types)
    } catch (err) {
      console.error('Error fetching vehicle types:', err)
      res.status(500).json({ message: 'Error fetching vehicle types' })
    }
  }
)

export default vehicleTypeRouter
