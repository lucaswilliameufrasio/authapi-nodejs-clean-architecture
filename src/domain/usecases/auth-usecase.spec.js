const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

const makeSut = () => {
    class LoadUserByEmailRepository {
        async load(email) {
            this.email = email
        }
    }

    const loadUserByEmailRepository = new LoadUserByEmailRepository()

    const sut = new AuthUseCase(loadUserByEmailRepository)

    return {
        sut,
        loadUserByEmailRepository
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
        const { sut, loadUserByEmailRepository } = makeSut()

        await sut.auth('any_email@email.com', 'any_password')

        expect(loadUserByEmailRepository.email).toBe('any_email@email.com')
    })

    test('It should throw if no LoadUserByEmailRepository is provided', async () => {
        const sut = new AuthUseCase()

        const promise = sut.auth('any_email@email.com', 'any_password')

        expect(promise).rejects.toThrow()
    })

    test('It should throw if no LoadUserByEmailRepository has no load method', async () => {
        const sut = new AuthUseCase({})

        const promise = sut.auth('any_email@email.com', 'any_password')

        expect(promise).rejects.toThrow()
    })

    test('It should return null if LoadUserByEmailRepository returns null', async () => {
        const { sut } = makeSut()

        const accessToken = await sut.auth('invalid_email@email.com', 'any_password')

        expect(accessToken).toBeNull()
    })
})
