// src/routes/vehicleRouter.ts
import { Router, Request, Response } from 'express'
import prisma from '../../lib/prisma'

const vehicleRouter = Router()

// GET /api/vehicles/:typeId
vehicleRouter.get(
  '/:typeId',
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.typeId)
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid typeId' })
      return
    }

    try {
      const vehicles = await prisma.vehicle.findMany({ where: { typeId: id } })
      res.json(vehicles)
    } catch (err) {
      console.error('Error fetching vehicles:', err)
      res.status(500).json({ message: 'Error fetching vehicles' })
    }
  }
)

export default vehicleRouter
