import { loadMatch, loadRedirect } from 'retil-nav'
import { patternFor } from 'retil-nav-scheme'

import ChangeEmail from './changeEmailPage'
import ChangePassword from './changePasswordPage'
import Membership from './membership'
import scheme from './settingsScheme'

const loader = loadMatch({
  './': loadRedirect('./' + scheme.membership()),
  [patternFor(scheme.changeEmail)]: <ChangeEmail />,
  [patternFor(scheme.changePassword)]: <ChangePassword />,
  [patternFor(scheme.membership)]: <Membership />,
})

export default loader
