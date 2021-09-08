import { graphql } from 'msw'

export const handlers = [
  // Inserts a login into the `logins` row
  graphql.mutation('InsertLogin', (_req, res, ctx) => {
    return res(ctx.data({
      insert_logins_one: {
        created_at: new Date(),
      }
    }))
  }),
  graphql.mutation('InsertLoginWithToken', (req, res, ctx) => {
    const { auth_time, customer_id } = req.body?.variables || {}

    if (!auth_time || !customer_id) {
      return res(
        ctx.errors([
          {
            message: 'Invalid request',
            errorType: 'Invalid ',
          },
        ]),
      )
    } else {
      return res(
        ctx.data({
          insert_logins_one: {
            created_at: new Date(),
            firebase_token: {
              customer_id,
            }
          }
        }),
      )
    }
  })
]