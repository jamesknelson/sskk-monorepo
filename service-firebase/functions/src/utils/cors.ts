import * as CORS from 'cors'

import { config } from '../firebase'

const corsConfig = config.cors
const whitelist =
  corsConfig.origin === '*' ? true : corsConfig.origin.split(',')

const cors = CORS({
  methods: 'GET,POST',
  origin: (origin, callback) => {
    if (whitelist === true || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
})

export default cors