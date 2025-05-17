// src/actions/vehicleActions.ts
import { api } from './api'

export type VehicleType = {
  id: number
  name: string
  wheelCount: number
}

export type Vehicle = {
  id: number
  modelName: string
  typeId: number
}

/**
 * Fetch all vehicle types for a given wheel count (2 or 4).
 */
export async function fetchVehicleTypes(
  wheelCount: '2' | '4'
): Promise<VehicleType[]> {
  const res = await api.get<VehicleType[]>(
    `/vehicletype/vehicle-type?wheelCount=${wheelCount}`
  )
  return res.data
}

/**
 * Fetch all vehicles for a given vehicle-type ID.
 */
export async function fetchVehicles(typeId: string): Promise<Vehicle[]> {
  const res = await api.get<Vehicle[]>(`/vehicle/${typeId}`)
  return res.data
}
