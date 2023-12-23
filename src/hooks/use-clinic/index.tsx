import {
  GET_ALL_CLIENTS,
  GET_APPOINTMENTS,
  GET_APPOINTMENTS_PER_DATETIME,
  GET_CLINIC_COMMENTS,
  GET_MY_CLINIC,
  GET_MY_EMPLOYEES,
  INVITE_TO_CLINIC,
  REASSIGN_APPOINTMENT,
  RESPOND_APPOINTMENT,
  SAVE_CLINIC_IMAGE,
  UPDATE_CLINIC,
  UPDATE_APPOINTMENT_RESUMEN,
} from '@/graphql/clinic'
import { useAtom, useAtomValue } from 'jotai'
import { Employee, employeesAtom } from './employeesAtom'
import client from '@/utils/apolloClient'
import {
  Appointment,
  AppointmentForm,
  AppointmentState,
  AppointmentStatus,
  Clinic,
} from '@/types/clinic'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { userAtom } from '../use-user/userAtom'
import { Role } from '@/types/role'

export function useClinic() {
  const [currentEmployees] = useAtom(employeesAtom)
  const user = useAtomValue(userAtom)
  const queryClient = useQueryClient()

  const { data: clinic } = useQuery({
    queryKey: ['clinic'],
    queryFn: getMyClinic,
  })

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: getMyEmployees,
  })

  const { data: allAppointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: getAppointments,
  })

  async function getVeterinaryAppointments(): Promise<
    Appointment[] | undefined
  > {
    const {
      data: { getAppointmentPerRangeDateTime },
    } = await client.query({
      query: GET_APPOINTMENTS_PER_DATETIME,
      variables: {
        filterAppointmentByDateRangeInput: {
          start_at: '2023-01-01T04:00:00.000Z',
          end_at: '2030-01-01T04:00:00.000Z',
        },
      },
    })

    return getAppointmentPerRangeDateTime
  }

  async function getMyEmployees(): Promise<
    {
      id_employee: string
      status: boolean
      Employee: Employee
    }[]
  > {
    const {
      data: { getMyEmployees },
    } = await client.query<any>({
      query: GET_MY_EMPLOYEES,
    })

    return getMyEmployees.ClinicEmployees
  }

  async function getMyClients() {
    const {
      data: { getAllClients },
    } = await client.query<any>({
      query: GET_ALL_CLIENTS,
    })
    return getAllClients
  }

  function findEmployeeByEmail(email: string): Employee | undefined {
    if (!currentEmployees) return undefined

    const selectedEmployee = currentEmployees.find(
      ({ email: employeeEmail }) => {
        return employeeEmail === email
      }
    )

    return selectedEmployee
  }

  async function getMyClinic() {
    const {
      data: { getMyClinic },
    } = await client.query<{ getMyClinic: Clinic }>({
      query: GET_MY_CLINIC,
    })

    return getMyClinic
  }

  async function sendInvitationToClinic(email: string) {
    // @ts-ignore
    const { id: clinicId } = clinic

    const variables = {
      inviteToClinicInput: {
        id: clinicId,
        email,
        employee_invitation_status: 'PENDING',
      },
    }
    const request = await client.mutate({
      mutation: INVITE_TO_CLINIC,
      variables,
    })

    return request
  }

  async function updateClinic(payload: UpdateClinicForm) {
    const {
      data: { updateClinic },
    } = await client.mutate({
      mutation: UPDATE_CLINIC,
      variables: {
        updateClinicInput: { ...payload },
      },
    })

    return updateClinic
  }

  async function updateAppointmentResumen(payload: AppointmentForm) {
    const {
      data: { updateAppointmentResumen },
    } = await client.mutate({
      mutation: UPDATE_APPOINTMENT_RESUMEN,
      variables: {
        updateAppointmentResumenInput: { ...payload },
      },
    })

    return updateAppointmentResumen
  }

  async function getAppointments(): Promise<Appointment[] | undefined> {
    if (!user) return

    if (user.role === Role.VETERINARIAN) {
      return await getVeterinaryAppointments()
    }

    const {
      data: { getAppointmentDetailClinicOwner },
    } = await client.query<{
      getAppointmentDetailClinicOwner: any[]
    }>({
      query: GET_APPOINTMENTS,
      variables: {
        filterAppointmentBySSInput: {
          state: null,
          appointment_status: null,
        },
      },
    })

    return getAppointmentDetailClinicOwner
  }

  function getPendingAppointments(): Appointment[] | null {
    if (!allAppointments) return null

    return allAppointments.filter(
      ({
        state,
        appointment_status,
      }: {
        state: AppointmentState
        appointment_status: AppointmentStatus
      }) => {
        return (
          state === AppointmentState.PENDING &&
          appointment_status !== AppointmentStatus.DENIED
        )
      }
    )
  }

  async function getVerifiedAppointments(): Promise<Appointment[] | undefined> {
    const appointments = await getAppointments()

    return appointments?.filter(({ appointment_status }) => {
      return appointment_status === AppointmentStatus.ACCEPTED
    })
  }

  async function reassignAppointment(
    appointmentId: string,
    veterinarianId: string
  ) {
    const {
      data: { reassignAppoinment },
    } = await client.mutate({
      mutation: REASSIGN_APPOINTMENT,
      variables: {
        reassignAppointmentToVeterinarianInput: {
          id: appointmentId,
          id_veterinarian: veterinarianId,
        },
      },
    })

    return reassignAppoinment
  }

  function getMyEmployeesForSelect():
    | { value: string; label: string }[]
    | null {
    if (!employees) return null

    return employees.map(({ id_employee, Employee }) => {
      return {
        value: id_employee,
        label: `${Employee.names} ${Employee.surnames}`,
      }
    })
  }

  async function respondToAppointment(
    appointmentId: string,
    id_veterinarian: string,
    status: AppointmentStatus
  ) {
    const {
      data: { respondToAppointment },
    } = await client.mutate<any>({
      mutation: RESPOND_APPOINTMENT,
      variables: {
        updateAppointmentInput: {
          id: appointmentId,
          appointment_status: status,
          id_veterinarian,
          // end_at: '2022-03-06T08:23:45.000Z',
        },
      },
    })

    return respondToAppointment
  }

  async function getMyClinicComments() {
    const {
      data: { getMyComments },
    } = await client.query<any>({ query: GET_CLINIC_COMMENTS })

    return getMyComments
  }

  async function saveClinicImage(file: File) {
    const {
      data: { saveClinicImage },
    } = await client.mutate({
      mutation: SAVE_CLINIC_IMAGE,

      variables: {
        saveClinicImageInput: {
          image: file,
          old_image: clinic?.image,
        },
      },
    })

    queryClient.invalidateQueries({
      queryKey: ['clinic'],
    })

    return saveClinicImage
  }

  return {
    getMyClinic,
    getMyEmployees,
    getMyClients,
    getMyClinicComments,
    getAppointments,
    getPendingAppointments,
    getVeterinaryAppointments,
    getMyEmployeesForSelect,
    getVerifiedAppointments,
    findEmployeeByEmail,
    sendInvitationToClinic,
    updateClinic,
    respondToAppointment,
    reassignAppointment,
    saveClinicImage,
    updateAppointmentResumen,
  }
}

export type UpdateClinicForm = {
  name: string
  email: string
  telephone_number: string
  address: string
}
