import { loadMatch, loadRedirect } from 'retil-nav'

import { patternFor } from 'src/utils/urls'

import ChangeEmail from './changeEmailPage'
import ChangePassword from './changePasswordPage'
import Membership from './membership'
import urls from './settingsURLs'

const loader = loadMatch({
  './': loadRedirect('./' + urls.membership()),
  [patternFor(urls.changeEmail)]: <ChangeEmail />,
  [patternFor(urls.changePassword)]: <ChangePassword />,
  [patternFor(urls.membership)]: <Membership />,
})

export default loader
