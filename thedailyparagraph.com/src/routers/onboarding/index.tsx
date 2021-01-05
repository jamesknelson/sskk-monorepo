import * as React from 'react'
import { routeByPattern } from 'retil-router'

import ConnectTwitter from './connectTwitter'
import Payment from './payment'
import Thankyou from './thankyou'

export default routeByPattern({
  './connect-twitter': <ConnectTwitter />,
  './payment': <Payment />,
  './thankyou': <Thankyou />,
})
