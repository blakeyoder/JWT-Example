import express from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
import PassportJwt, { StrategyOptions } from "passport-jwt"
import _ from "lodash"
import { users } from "./users" 

const opts: StrategyOptions = {
  jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret'
}

passport.use(new PassportJwt.Strategy(opts, function(payload, done) {
  console.log(payload)
  const user = users[_.findIndex(users, {id: payload.id})]
  if (user) {
    done(null, user)
  } else {
    done(null, false)
  }
}))

export const createToken: (name: string, password: string) => string | undefined = (name: string, password: string) => {
  const user = users[_.findIndex(users, { name })]
  if (!user) {
    return undefined
  }
  if (password === user.password) {
    return jwt.sign({ id: user.id }, opts.secretOrKey)
  }
  return undefined
}

const createApplication: () => express.Application = () => {
  const app: express.Application = express()
  app.use(passport.initialize())
  app.use(express.json())

  return app
}

export default createApplication
