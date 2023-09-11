import { gql } from '@apollo/client';

export const GET_ALL_EMPLOYEES = gql`
  query ($getAllEmployeeByIdInput: GetAllEmployeeByIdInput!) {
    getAllEmployee(getAllEmployeeByIdInput: $getAllEmployeeByIdInput) {
      employee {
        names
        surnames
        email
      }
      id_clinic
      id_employee
      employee_invitation_status
      created_at
      updated_at
      status
    }
  }
`;

export const GET_MY_CLINIC = gql`
  query {
    getMyClinic {
      id
      id_owner
      name
      telephone_number
      google_maps_url
      address
      created_at
      updated_at
      status
    }
  }
`;
