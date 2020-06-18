const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')

// sut = system under test
const makeSut = () => {
  return new LoginRouter()
}

describe('Login Router', () => {
  test('It should return 400 status if no email is provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        password: 'any'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('It should return 400 status if no password is provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        email: 'any@example.org'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })

  test('It should return 500 status if httpRequest provided', () => {
    const sut = makeSut()

    const httpResponse = sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  test('It should return 500 status if httpRequest has no body', () => {
    const sut = makeSut()
    const httpRequest = {}

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })
})
