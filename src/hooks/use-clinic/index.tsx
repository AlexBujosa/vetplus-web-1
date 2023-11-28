import {
  GET_ALL_CLIENTS,
  GET_APPOINTMENTS,
  GET_MY_CLINIC,
  GET_MY_EMPLOYEES,
  INVITE_TO_CLINIC,
  RESPOND_APPOINTMENT,
  UPDATE_CLINIC,
} from '@/graphql/clinic'
import { useAtom } from 'jotai'
import { Employee, employeesAtom } from './employeesAtom'
import client from '@/utils/apolloClient'
import {
  Appointment,
  AppointmentState,
  AppointmentStatus,
  Clinic,
} from '@/types/clinic'
import { useQuery } from '@tanstack/react-query'

export function useClinic() {
  const [currentEmployees] = useAtom(employeesAtom)

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

  async function getMyEmployees(): Promise<
    {
      id_employee: string
      status: boolean
      Employee: Employee
    }[]
  > {
    const { getMyEmployees } = await client.request<any>(GET_MY_EMPLOYEES)

    return getMyEmployees.ClinicEmployees
  }

  async function getMyClients() {
    const { getAllClients } = await client.request<any>(GET_ALL_CLIENTS)
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
    const { getMyClinic } = await client.request<{ getMyClinic: Clinic }>(
      GET_MY_CLINIC
    )

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
    const request = await client.request(INVITE_TO_CLINIC, variables)

    return request
  }

  async function updateClinic(payload: UpdateClinicForm) {
    const { updateClinic } = await client.request<{
      updateClinic: { result: string }
    }>(UPDATE_CLINIC, {
      updateClinicInput: { ...payload },
    })

    return updateClinic
  }

  async function getAppointments() {
    const { getAppointmentDetailClinicOwner } = await client.request<{
      getAppointmentDetailClinicOwner: Appointment[]
    }>(GET_APPOINTMENTS, {
      filterAppointmentBySSInput: {
        state: null,
        appointment_status: null,
      },
    })

    return getAppointmentDetailClinicOwner
  }

  function getPendingAppointments(): Appointment[] | null {
    if (!allAppointments) return null

    return allAppointments.filter(({ state, appointment_status }) => {
      return (
        state === AppointmentState.PENDING &&
        appointment_status !== AppointmentStatus.ACCEPTED
      )
    })
  }

  function getVerifiedAppointments(): Appointment[] | null {
    if (!allAppointments) return null

    return allAppointments.filter(({ appointment_status }) => {
      return appointment_status === AppointmentStatus.ACCEPTED
    })
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
    status: AppointmentStatus
  ) {
    const { respondToAppointment } = await client.request<any>(
      RESPOND_APPOINTMENT,
      {
        updateAppointmentInput: {
          id: appointmentId,
          appointment_status: status,
          // end_at: '2022-03-06T08:23:45.000Z',
        },
      }
    )

    return respondToAppointment
  }

  return {
    getMyClinic,
    getMyEmployees,
    getMyClients,
    getAppointments,
    getPendingAppointments,
    getMyEmployeesForSelect,
    getVerifiedAppointments,
    findEmployeeByEmail,
    sendInvitationToClinic,
    updateClinic,
    respondToAppointment,
  }
}

export type UpdateClinicForm = {
  name: string
  email: string
  telephone_number: string
  address: string
}
