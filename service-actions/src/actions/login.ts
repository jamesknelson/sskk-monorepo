import type { RequestHandler } from 'express'

const loginHandler: RequestHandler = (req, res, next) => {
  // - if there's an auth token, pull custid & authtime out of session
  //   variable using claims_map
  //   see: https://hasura.io/blog/turn-your-node-js-rest-api-to-graphql/
  // - upsert a "clients" record from cookie, ip and user agent,
  //     add a signed cookie w/ the id to the response
  // - if an auth token is provided, upsert a login record
  // - if a referral is provided, record it 
  // - requires a referrer to be provided
  
  // - if there's an auth token and no existing matching login row 
  // - 
  // - otherwise, 
  // - because we're keying on custid/authtime, in general, the ip address/user agent
  //   should never actually change, and custid/authtime should be unique in most typical
  //   situations
  // - we shouldn't allow anyone to perform any user actions unless they've got a login
  //   record matching their custid/authtime – this way, we always know where the actions
  //   are coming from, and can reject login if it seems odd, are able to show users where
  //   they're logged in, and are also able to invalidate specific firebase tokens.
  // - this also allows us to record a device id, which obviously can be spoofed, but in
  //   typical situations it'll allow us to connect users with any browsing history we
  //   end up storing against that same device id. maybe we dont' end up doing it, but
  //   I think it's best to leave the option open.
  // - return profile info
}

export default loginHandler
