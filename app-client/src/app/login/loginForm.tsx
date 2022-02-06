import { getIssueMessage } from 'retil-issues'
import { useNavController } from 'retil-nav'

import appScheme from '~/app/appScheme'
import { useAuthController } from '~/env/auth'
import { validateSignInWithPasswordRequest } from '~/env/auth/authServiceIssues'
import { messages } from '~/locale/en'
import { createForm, useForm } from '~/util/form'

export const LoginForm = createForm((props) => {
  const { signInWithPassword } = useAuthController()
  const { navigate } = useNavController()

  return useForm({
    ...props,
    getMessage: (issue) =>
      getIssueMessage(issue, messages) || issue.message || issue.code,
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
          await navigate(appScheme.read.summary())
        }
      }
    },
    onValidate: validateSignInWithPasswordRequest,
  })
})
