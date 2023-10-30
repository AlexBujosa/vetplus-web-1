import {
  GET_ALL_CLIENTS,
  GET_MY_CLINIC,
  GET_MY_EMPLOYEES,
} from '@/graphql/clinic'
import { useQuery } from '@apollo/client'
import { useAtom } from 'jotai'
import { Employee, employeesAtom } from './employeesAtom'
import client from '@/utils/apolloClient'
import { Clinic } from '@/types/clinic'

export function useClinic() {
  const [currentEmployees] = useAtom(employeesAtom)

  function getMyEmployees(): {
    data?: Employee[]
    loading: boolean
  } {
    const { data, loading } = useQuery(GET_MY_EMPLOYEES)

    const employees = data?.getMyEmployees.ClinicEmployees.map(
      (employeeObject: any): Employee => {
        const { Employee, status } = employeeObject
        const {
          names,
          surnames,
          email,
          VeterinarianSummaryScore,
          VeterinariaSpecialties,
          address,
          image,
          telephone_number: telephoneNumber,
        } = Employee
        const { specialties: specialty } = VeterinariaSpecialties
        const reviewScore =
          VeterinarianSummaryScore.total_users > 0
            ? VeterinarianSummaryScore.total_points /
              VeterinarianSummaryScore.total_users
            : 0
        const fullName = `${names} ${surnames}`

        return {
          fullName,
          names,
          surnames,
          email,
          image,
          specialty,
          address,
          telephoneNumber,
          status,
          score: reviewScore,
        }
      }
    )

    return {
      data: employees,
      loading,
    }
  }

  async function getMyClients() {
    return await client.request<any>(GET_ALL_CLIENTS)
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
    return await client.request<Clinic>(GET_MY_CLINIC)
  }

  return {
    getMyClinic,
    getMyEmployees,
    getMyClients,
    findEmployeeByEmail,
  }
}
