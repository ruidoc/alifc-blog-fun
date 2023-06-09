const { expressjwt: exjwt } = require('express-jwt')
var jwt = require('jsonwebtoken')

// 密匙
const SECRET_KEY = 'alifn_jueblog_jwt_8756'

// 生成jwt
function genoJwt(data) {
  let token = jwt.sign(data, SECRET_KEY, { expiresIn: '7d' })
  return token
}

// 验证jwt
function verifyJwt() {
  return exjwt({
    secret: SECRET_KEY,
    algorithms: ['HS256'],
    requestProperty: 'auth',
  })
}
module.exports = {
  genoJwt,
  verifyJwt,
}
