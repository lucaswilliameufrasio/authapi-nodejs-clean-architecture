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
class AuthUseCase {
    constructor(loadUserByEmailRepository) {
        this.loadUserByEmailRepository = loadUserByEmailRepository
    }

    async auth(email, password) {
        if (!email) {
            throw new MissingParamError('email')
        }
        if (!password) {
            throw new MissingParamError('password')
        }

        await this.loadUserByEmailRepository.load(email)
    }
}

describe('Auth UseCase', () => {
    test('Should return null if no email is provided', async () => {
        const { sut } = makeSut()

        const promise = sut.auth()

        expect(promise).rejects.toThrow(new MissingParamError('email'))
    })

    test('Should return null if no password is provided', async () => {
        const { sut } =  makeSut()

        const promise = sut.auth('any_email@email.com')

        expect(promise).rejects.toThrow(new MissingParamError('password'))
    })

    test('Should call LoadUserByEmailRepository with correct email', async () => {
        const { sut, loadUserByEmailRepository } =  makeSut()

        await sut.auth('any_email@email.com', 'any_password')

        expect(loadUserByEmailRepository.email).toBe('any_email@email.com')
    })
})
