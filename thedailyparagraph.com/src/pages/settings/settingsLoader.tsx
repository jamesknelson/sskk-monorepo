import * as React from 'react'
import { loadMatch, loadRedirect } from 'retil-nav'

import { urls } from 'src/utils/urls'

import ChangeEmail from './changeEmailPage'
import ChangePassword from './changePasswordPage'
import Membership from './membership'

const relativeURLs = urls.settings._

const loader = loadMatch({
  './': loadRedirect(relativeURLs.membership().pathname),
  [relativeURLs.changeEmail().pathname]: <ChangeEmail />,
  [relativeURLs.changePassword().pathname]: <ChangePassword />,
  [relativeURLs.membership().pathname]: <Membership />,
})

export default loader
