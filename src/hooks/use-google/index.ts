import { app } from '@/utils/firebase'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

export const provider = new GoogleAuthProvider()

export const auth = getAuth(app)
