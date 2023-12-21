import { Pet } from './pet'
import { User } from './user'

export type Clinic = {
  name: string
  telephoneNumber: string
  address: string
  image: string
  email: string
  created_at: string
  google_maps_url: null
  id: string
  id_owner: string
  schedule: any
  services: string[]
  status: boolean
  telephone_number: string
  updated_at: string
  ClinicSummaryScore: Score
}

export type Veterinarian = {
  id: string
  names: string
  surnames: string
  email: string
  provider: string
  document: string
  address: string
  telephone_number: string
  image: string
  role: string
  created_at: Date
  updated_at: Date
  status: true
}

export type Score = {
  total_points: number
  total_users: number
}

export type AppointmentForm = {
  id: string
  id_clinic: string
  id_owner: string
  observations: {
    suffering: string[]
    treatment: string
    feed: string
    deworming: {
      date: string
      product: string
    }
    reproductiveTimeline: {
      reproductiveHistory: string
      dateLastHeat: string
      dateLastBirth: string
    }
    vaccines: {
      date: string
      vaccineBrand: string
      vaccineBatch: string
    }
  }
}

export type Appointment = {
  id: string
  id_owner: string
  id_veterinarian: string
  id_pet: string
  services: string[]
  id_clinic: string
  observations: Observation
  appointment_status: AppointmentStatus
  state: AppointmentState
  start_at: Date
  end_at: Date
  created_at: Date
  updated_at: Date
  status: true
  Clinic: Clinic
  Pet: Pet
  Veterinarian: Veterinarian
  Owner: User
}

type Observation = {
  suffering: string[]
  treatment: string
  feed: string
}

export enum AppointmentState {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED',
}

export enum AppointmentStatus {
  ACCEPTED = 'ACCEPTED',
  DENIED = 'DENIED',
}
