const bcrypt = require('bcrypt')
class Encrypter {
  async compare(value, hash) {
    const isValid = bcrypt.compare(value, hash)

    return isValid
  }
}

describe('Encrypter', () => {
  test('It should return true if bcrypt return true', async () => {
    const sut = new Encrypter()

    const isValid = await sut.compare('any_value', 'hashed_value')

    expect(isValid).toBe(true)
  })

  test('It should return false if bcrypt return false', async () => {
    const sut = new Encrypter()

    bcrypt.isValid = false

    const isValid = await sut.compare('any_value', 'hashed_value')

    expect(isValid).toBe(false)
  })

  test('It should call bcrypt with correct values', async () => {
    const sut = new Encrypter()

    await sut.compare('any_value', 'hashed_value')

    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('hashed_value')
  })
})
