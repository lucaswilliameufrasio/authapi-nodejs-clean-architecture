class LoginRouter {
  route(httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }

    const { email, password } = httpRequest.body

    if (!email) {
      return HttpResponse.badRequest('email')
    }
    if (!password) {
      return HttpResponse.badRequest('password')
    }
  }
}

class HttpResponse {
  static badRequest(paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }
  static serverError() {
    return {
      statusCode: 500
    }
  }
}

class MissingParamError extends Error {
  constructor(paramName) {
    super(`Missing param ${paramName}`)
    this.name = 'MissingParamName'
  }
}

describe('Login Router', () => {
  test('It should return 400 status if no email is provided', () => {
    // sut = system under test
    const sut = new LoginRouter()
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
    // sut = system under test
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any@example.org'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })

  test('It should return 500 status if httpRequest provided', () => {
    // sut = system under test
    const sut = new LoginRouter()

    const httpResponse = sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  test('It should return 500 status if httpRequest has no body', () => {
    // sut = system under test
    const sut = new LoginRouter()
    const httpRequest = {}

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })
})
