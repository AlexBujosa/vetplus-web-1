import { GET_ALL_EMPLOYEES, GET_MY_CLINIC } from '@/graphql/clinic';
import { useQuery } from '@apollo/client';

export function useClinic() {
  function getAllEmployees() {
    const { data: clinicData } = useQuery(GET_MY_CLINIC);

    const { data, loading } = useQuery(GET_ALL_EMPLOYEES, {
      variables: {
        getAllEmployeeByIdInput: {
          id: clinicData?.getMyClinic.id,
        },
      },
    });

    return {
      data,
      loading,
    };
  }
  return {
    getAllEmployees,
  };
}
