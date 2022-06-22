import { root } from 'retil-support'

// TODO:
// - This is not generated right now. But it should be generated
//   from some sort of software somewhere.

export const messages = {
  [root]: {
    alreadyLoggedIn: "You're already logged in!",
    error: 'Something went wrong.',
  },
  email: {
    taken: "There's already an account with that email.",
    disabled: 'Your account is disabled.',
    invalid: "That email somehow doesn't look quite right.",
    label: 'Email',
    missing: 'Please enter your email.',
  },
  displayName: {
    label: 'Name',
    missing: 'Please enter your name.',
  },
  password: {
    label: 'Password',
    missing: 'Please enter your password.',
    weak: 'Your password must contain at least 6 characters.',
    mismatch: 'That password looks incorrect.',
  },
}
