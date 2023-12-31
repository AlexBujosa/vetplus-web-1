import {
  GET_ALL_CLIENTS,
  GET_MY_CLINIC,
  GET_MY_EMPLOYEES,
  INVITE_TO_CLINIC,
} from '@/graphql/clinic'
import { useAtom } from 'jotai'
import { Employee, employeesAtom } from './employeesAtom'
import client from '@/utils/apolloClient'
import { Clinic } from '@/types/clinic'

export function useClinic() {
  const [currentEmployees] = useAtom(employeesAtom)

  async function getMyEmployees(): Promise<Employee[]> {
    const { getMyEmployees } = await client.request<any>(GET_MY_EMPLOYEES)

    return getMyEmployees
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
    const request = await client.request<Clinic>(GET_MY_CLINIC)

    return request
  }

  async function sendInvitationToClinic(email: string) {
    const clinic = await getMyClinic()
    // @ts-ignore
    const clinicId = clinic.getMyClinic.id

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

  return {
    getMyClinic,
    getMyEmployees,
    getMyClients,
    findEmployeeByEmail,
    sendInvitationToClinic,
  }
}
