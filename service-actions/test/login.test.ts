import request from 'supertest'

import app from '../src/app'
import { actionSecret } from '../src/config'
import { customerId } from '../src/mocks'

describe('login action', () => {
  test('should return 400 when action secret is not supplied', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        session_variables: {
          'x-hasura-auth-time': Date.now() / 1000,
          'x-hasura-customer-id': customerId,
        },
        input: {},
        action: {
          name: 'login',
        },
      })

    expect(response.statusCode).toBe(400)
  })

  test('should return a customerId when supplied with a valid one', async () => {
    const response = await request(app)
      .post('/login')
      .set("action-secret", actionSecret)
      .send({
        session_variables: {
          'x-hasura-auth-time': Date.now() / 1000,
          'x-hasura-customer-id': customerId,
        },
        input: {},
        action: {
          name: 'login',
        },
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.customer_id).toBe(customerId)
  })

  test('should not return a customerId when not supplied with one', async () => {
    const response = await request(app)
      .post('/login')
      .set("action-secret", actionSecret)
      .send({
        session_variables: {},
        input: {},
        action: {
          name: 'login',
        },
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.customer_id).toBe(null)
  })
})
