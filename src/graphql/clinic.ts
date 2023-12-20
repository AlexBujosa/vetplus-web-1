import { gql } from '@apollo/client'

export const GET_MY_EMPLOYEES = gql`
  query GetMyEmployees {
    getMyEmployees {
      ClinicEmployees {
        id_employee
        status
        Employee {
          names
          surnames
          image
          email
          address
          telephone_number
          VeterinarianSummaryScore {
            total_points
            total_users
          }
          VeterinariaSpecialties {
            specialties
          }
        }
      }
    }
  }
`

export const GET_MY_CLINIC = gql`
  query {
    getMyClinic {
      id
      id_owner
      name
      telephone_number
      google_maps_url
      email
      image
      address
      created_at
      updated_at
      status
      services
      ClinicSummaryScore {
        total_points
        total_users
      }
      schedule {
        workingDays {
          day
          startTime
          endTime
        }
        nonWorkingDays
      }
    }
  }
`

export const GET_ALL_EMPLOYEES = gql`
  query ($getAllEmployeeByClinicIdInput: GetAllEmployeeByClinicIdInput!) {
    getAllEmployee(
      getAllEmployeeByClinicIdInput: $getAllEmployeeByClinicIdInput
    ) {
      id_clinic
      id_employee
      employee_invitation_status
      created_at
      updated_at
      status
      employee {
        names
        surnames
        image
        email
        status
      }
    }
  }
`

export const GET_ALL_CLIENTS = gql`
  query {
    getAllClients {
      id_user
      id_clinic
      favorite
      points
      created_at
      updated_at
      status
      User {
        id
        names
        surnames
        email
        provider
        document
        address
        telephone_number
        image
        role
        created_at
        updated_at
        status
        Pet {
          id
          image
          name
        }
        AppointmentOwner {
          start_at
        }
      }
    }
  }
`

export const INVITE_TO_CLINIC = gql`
  mutation ($inviteToClinicInput: InviteToClinicInput!) {
    inviteToClinic(inviteToClinicInput: $inviteToClinicInput) {
      result
    }
  }
`

export const GET_MY_COMMENTS = gql`
  query ($genericByIdInput: GenericByIdInput!) {
    getMyComments(genericByIdInput: $genericByIdInput) {
      id
      id_clinic
      id_owner
      comment
      created_at
      updated_at
      status
      Owner {
        names
        surnames
        image
      }
    }
  }
`

export const UPDATE_CLINIC = gql`
  mutation ($updateClinicInput: UpdateClinicInput!) {
    updateClinic(updateClinicInput: $updateClinicInput) {
      result
    }
  }
`

export const GET_APPOINTMENTS = gql`
  query ($filterAppointmentBySSInput: FilterAppointmentBySSInput!) {
    getAppointmentDetailClinicOwner(
      filterAppointmentBySSInput: $filterAppointmentBySSInput
    ) {
      start_at
      end_at
      id
      id_owner
      id_veterinarian
      id_pet
      services
      id_clinic
      appointment_status
      state
      created_at
      updated_at
      status
      Clinic {
        id
        id_owner
        name
        telephone_number
        google_maps_url
        email
        image
        address
        created_at
        updated_at
        status
      }
      Pet {
        id
        id_owner
        id_specie
        id_breed
        name
        image
        gender
        castrated
        dob
        created_at
        updated_at
        status
      }
      Veterinarian {
        id
        names
        surnames
        email
        provider
        document
        address
        telephone_number
        image
        role
        created_at
        updated_at
        status
      }
      Owner {
        id
        names
        surnames
        email
        provider
        document
        address
        telephone_number
        image
        role
        created_at
        updated_at
        status
      }
    }
  }
`

export const RESPOND_APPOINTMENT = gql`
  mutation ($updateAppointmentInput: UpdateAppointmentInput!) {
    respondToAppointment(updateAppointmentInput: $updateAppointmentInput) {
      result
    }
  }
`

export const REASSIGN_APPOINTMENT = gql`
  mutation (
    $reassignAppointmentToVeterinarianInput: ReassignAppointmentToVeterinarianInput!
  ) {
    reassignAppoinment(
      reassignAppointmentToVeterinarianInput: $reassignAppointmentToVeterinarianInput
    ) {
      result
    }
  }
`

export const GET_CLINIC_COMMENTS = gql`
  query {
    getMyComments {
      id
      id_clinic
      id_owner
      comment
      created_at
      updated_at
      status
      Owner {
        names
        surnames
        image
      }
    }
  }
`

export const GET_APPOINTMENTS_PER_DATETIME = gql`
  query (
    $filterAppointmentByDateRangeInput: FilterAppointmentByDateRangeInput!
  ) {
    getAppointmentPerRangeDateTime(
      filterAppointmentByDateRangeInput: $filterAppointmentByDateRangeInput
    ) {
      start_at
      end_at
      id
      id_owner
      id_veterinarian
      id_pet
      services
      id_clinic
      observations {
        suffering
        treatment
        feed
      }
      appointment_status
      state
      created_at
      updated_at
      status
      Clinic {
        id
        id_owner
        name
        telephone_number
        google_maps_url
        email
        image
        address
        created_at
        updated_at
        status
      }
      Pet {
        id
        id_owner
        id_specie
        id_breed
        name
        image
        gender
        castrated
        dob
        observations
        created_at
        updated_at
        status
      }
      Veterinarian {
        id
        names
        surnames
        email
        provider
        document
        address
        telephone_number
        image
        role
        created_at
        updated_at
        status
      }
      Owner {
        id
        names
        surnames
        email
        provider
        document
        address
        telephone_number
        image
        role
        created_at
        updated_at
        status
      }
    }
  }
`

export const SAVE_CLINIC_IMAGE = gql`
  mutation ($saveClinicImageInput: SaveClinicImageInput!) {
    saveClinicImage(saveClinicImageInput: $saveClinicImageInput) {
      result
      image
    }
  }
`
