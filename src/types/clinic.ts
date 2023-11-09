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

export type Score = {
  total_points: number
  total_users: number
}
