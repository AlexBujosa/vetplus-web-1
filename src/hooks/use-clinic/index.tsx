import { GET_MY_EMPLOYEES } from '@/graphql/clinic'
import { useQuery } from '@apollo/client'
import { useAtom } from 'jotai'
import { employeesAtom } from './employeesAtom'

export function useClinic() {
  const [employees] = useAtom(employeesAtom)

  function getMyEmployees() {
    const { data, loading } = useQuery(GET_MY_EMPLOYEES)

    const employees = data?.getMyEmployees.clinicEmployees.map(
      (employeeObject: any) => {
        const { employee, status } = employeeObject
        const { names, surnames, email, VeterinarianSummaryScore } = employee
        const reviewScore =
          VeterinarianSummaryScore.total_users > 0
            ? VeterinarianSummaryScore.total_points /
              VeterinarianSummaryScore.total_users
            : 0
        const fullName = `${names} ${surnames}`

        return {
          fullName,
          email,
          speciality: '',
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

  function getMyClients() {
    let data, loading

    return {
      data,
      loading,
    }
  }

  function findEmployeeByEmail(email: string) {
    if (!employees) return null

    console.log({ employees })

    return employees.find(({ employee }) => {
      const { email: employeeEmail } = employee

      return employeeEmail === email
    })
  }

  return {
    getMyEmployees,
    getMyClients,
    findEmployeeByEmail,
  }
}
