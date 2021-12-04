import { useNavController } from 'retil-nav'

import { useAuthController } from 'src/env/auth'
import { validateSignInWithPasswordRequest } from 'src/env/firebaseAuthIssues'
import { messages } from 'src/locales/en'
import appURLs from 'src/routes/appURLs'
import { createForm, useForm } from 'src/utils/form'

export const LoginForm = createForm((props) => {
  const { signInWithPassword } = useAuthController()
  const { navigate } = useNavController()

  return useForm({
    ...props,
    getMessage: (issue) =>
      (issue.path && messages.auth[issue.path][issue.code]) ||
      issue.message ||
      issue.code,
    initialValue: {
      email: '',
      password: '',
    },
    onSubmit: async (form) => {
      if (await form.validate()) {
        form.clearIssues()
        const createUserIssues = await signInWithPassword(form.model.value)
        if (createUserIssues) {
          form.addIssues(createUserIssues)
        } else {
          // Navigation is handled by the loader.
          await navigate(appURLs.read.summary())
        }
      }
    },
    onValidate: validateSignInWithPasswordRequest,
  })
})
