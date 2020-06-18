const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')

// sut = system under test
const makeSut = () => {
  // spy and stub
  // https://medium.com/trainingcenter/testes-unit%C3%A1rios-mocks-stubs-spies-e-todas-essas-palavras-dif%C3%ADceis-f2765ac87cc8
  class AuthUseCaseSpy {
    auth(email, password) {
      this.email = email
      this.password = password
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()

  const sut = new LoginRouter(authUseCaseSpy)

  return {
    sut,
    authUseCaseSpy
  }
}

describe('Login Router', () => {
  test('It should return 400 status if no email is provided', () => {
    const { sut } = makeSut()
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
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@example.org'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })

  test('It should return 500 status if httpRequest provided', () => {
    const { sut } = makeSut()

    const httpResponse = sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  test('It should return 500 status if httpRequest has no body', () => {
    const { sut } = makeSut()
    const httpRequest = {}

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  test('It should call AuthUseCase with correct params', () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any'
      }
    }
    sut.route(httpRequest)

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('It should return 401 status when invalid credentials are provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'invalid@email.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
  })
})
