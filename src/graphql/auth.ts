import { gql } from 'graphql-request'

export const SIGN_WITH_EMAIL_QUERY = gql`
  query ($signInInput: SignInInput!) {
    signInWithEmail(signInInput: $signInInput) {
      access_token
    }
  }
`

export const SIGN_IN_WITH_GOOGLE = gql`
  query {
    googleLogin {
      access_token
    }
  }
`
