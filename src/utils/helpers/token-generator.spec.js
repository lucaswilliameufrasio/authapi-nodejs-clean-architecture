class TokenGenerator {
    async generate(id) {
        return null
    }
}

describe('Token Generator', () => {
    test('It should return null with JWT returns null', async () => {
        const sut = new TokenGenerator()

        const token = await sut.generate('any_id')

        expect(token).toBe(null)
    })
})
