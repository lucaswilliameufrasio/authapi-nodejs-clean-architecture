class LoginRouter {
  route(httpRequest) {
    const { email, password } = httpRequest.body

    if (!email || !password) {
      return {
        statusCode: 400
      }
    }
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
})
