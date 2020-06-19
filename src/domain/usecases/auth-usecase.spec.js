const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

const makeEncrypter = () => {
    class EncrypterSpy {
        async compare(password, hashedPassword) {
            this.password = password
            this.hashedPassword = hashedPassword

            return this.isValid
        }
    }

    const encrypterSpy = new EncrypterSpy()
    encrypterSpy.isValid = true
    return encrypterSpy
}

const makeTokenGenerator = () => {
    class TokenGeneratorSpy {
        async generate(userId) {
            this.userId = userId

            return this.accessToken
        }
    }

    const tokenGeneratorSpy = new TokenGeneratorSpy()
    tokenGeneratorSpy.accessToken = 'any_token'
    return tokenGeneratorSpy
}

const makeUserByEmailRepository = () => {
    class LoadUserByEmailRepositorySpy {
        async load(email) {
            this.email = email

            return this.user
        }
    }

    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
    loadUserByEmailRepositorySpy.user = {
        id: 'any_id',
        password: 'hashed_password'
    }
    return loadUserByEmailRepositorySpy
}

const makeSut = () => {
    const encrypterSpy = makeEncrypter()
    const loadUserByEmailRepositorySpy = makeUserByEmailRepository()
    const tokenGeneratorSpy = makeTokenGenerator()
    const sut = new AuthUseCase({
        loadUserByEmailRepository: loadUserByEmailRepositorySpy,
        encrypter: encrypterSpy,
        tokenGenerator: tokenGeneratorSpy
    })

    return {
        sut,
        loadUserByEmailRepositorySpy,
        encrypterSpy,
        tokenGeneratorSpy
    }
}

describe('Auth UseCase', () => {
    test('It should return null if no email is provided', async () => {
        const { sut } = makeSut()

        const promise = sut.auth()

        expect(promise).rejects.toThrow(new MissingParamError('email'))
    })

    test('It should return null if no password is provided', async () => {
        const { sut } = makeSut()

        const promise = sut.auth('any_email@email.com')

        expect(promise).rejects.toThrow(new MissingParamError('password'))
    })

    test('It should call LoadUserByEmailRepository with correct email', async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut()

        await sut.auth('any_email@email.com', 'any_password')

        expect(loadUserByEmailRepositorySpy.email).toBe('any_email@email.com')
    })

    test('It should return null if an invalid email is provided', async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut()
        loadUserByEmailRepositorySpy.user = null

        const accessToken = await sut.auth('invalid_email@email.com', 'any_password')

        expect(accessToken).toBeNull()
    })

    test('It should return null if an invalid password is provided', async () => {
        const { sut, encrypterSpy } = makeSut()
        encrypterSpy.isValid = false

        const accessToken = await sut.auth('valid_email@email.com', 'invalid_password')

        expect(accessToken).toBeNull()
    })

    test('It should call Encrypter with correct values', async () => {
        const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
        await sut.auth('valid_email@email.com', 'any_password')

        expect(encrypterSpy.password).toBe('any_password')
        expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
    })

    test('It should call TokenGenerator with correct userId', async () => {
        const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
        await sut.auth('valid_email@email.com', 'valid_password')

        expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
    })

    test('It should return an access token with correct credentials are provided', async () => {
        const { sut, tokenGeneratorSpy } = makeSut()
        const accessToken = await sut.auth('valid_email@email.com', 'valid_password')

        expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
        expect(accessToken).toBeTruthy()
    })

    test('It should throw if invalid dependencies are provided', async () => {
        const invalid = {}
        const loadUserByEmailRepository = makeUserByEmailRepository()
        const suts = [].concat(
            new AuthUseCase(),
            new AuthUseCase({}),
            new AuthUseCase({
                loadUserByEmailRepository: invalid
            }),
            new AuthUseCase({
                loadUserByEmailRepository
            }),
        )

        for (const sut of suts) {
            const promise = sut.auth('any_email@email.com', 'any_password')

            expect(promise).rejects.toThrow()
        }
    })
})
