import { GET_MY_PROFILE, GET_USER_ROLE } from '@/graphql/user';
import { useAtom } from 'jotai';
import { userAtom } from './userAtom';
import { useQuery } from '@apollo/client';

export default function useUser() {
  const [user, setUser] = useAtom(userAtom);

  function getUserRole() {
    const { data, loading } = useQuery(GET_USER_ROLE);

    return { role: data?.getMyProfile.role, loading };
  }

  function getUserProfile() {
    const { data, loading } = useQuery(GET_MY_PROFILE, {
      skip: user !== undefined,
    });

    if (data) {
      setUser(data.getMyProfile);
    }

    return { data: data?.getMyProfile, loading };
  }

  return { getUserRole, getUserProfile };
}
