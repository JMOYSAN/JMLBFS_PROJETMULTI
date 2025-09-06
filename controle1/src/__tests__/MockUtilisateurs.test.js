import genererUtilisateurs from '../Mock/MockUtilisateurs.js'

const data = genererUtilisateurs()

describe('MockUtilisateurs', () => {
  it('should be an array', () => {
    expect(Array.isArray(data)).toBe(true)
  })

  it('should have user objects with required properties', () => {
    data.forEach((user) => {
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('nom')
      expect(user).toHaveProperty('statut')
    })
  })
})
