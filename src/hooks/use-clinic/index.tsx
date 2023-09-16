import { GET_MY_EMPLOYEES } from "@/graphql/clinic";
import { useQuery } from "@apollo/client";
import { useAtom } from "jotai";
import { employeesAtom } from "./employeesAtom";

export function useClinic() {
  const [currentEmployees] = useAtom(employeesAtom);
  function getMyEmployees() {
    const { data, loading } = useQuery(GET_MY_EMPLOYEES);

    const employees = data?.getMyEmployees.clinicEmployees.map(
      (employeeObject: any) => {
        const { employee, status } = employeeObject;
        const {
          names,
          surnames,
          email,
          VeterinarianSummaryScore,
          VeterinariaSpecialties,
          address,
          telephone_number,
        } = employee;
        const { specialties: specialty } = VeterinariaSpecialties;
        const reviewScore =
          VeterinarianSummaryScore.total_users > 0
            ? VeterinarianSummaryScore.total_points /
              VeterinarianSummaryScore.total_users
            : 0;
        const fullName = `${names} ${surnames}`;

        return {
          fullName,
          email,
          specialty,
          address,
          telephone_number,
          status,
          score: reviewScore,
        };
      }
    );

    return {
      data: employees,
      loading,
    };
  }

  function getMyClients() {
    let data, loading;

    return {
      data,
      loading,
    };
  }

  function findEmployeeByEmail(email: string) {
    if (!currentEmployees) return null;
    const selectedEmployee = currentEmployees.find((employee) => {
      const { email: employeeEmail } = employee;
      return employeeEmail === email;
    });

    return selectedEmployee;
  }

  return {
    getMyEmployees,
    getMyClients,
    findEmployeeByEmail,
  };
}
