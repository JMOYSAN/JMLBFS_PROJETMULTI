// Les tests on été écrits par ChatGPT

import genererGroupes from '../Mock/MockGroupe.js'

const data = genererGroupes()

describe('MockGroupe', () => {
  it('should be an array', () => {
    expect(Array.isArray(data)).toBe(true)
  })

  it('should have group objects with required properties', () => {
    data.forEach((groupe) => {
      expect(groupe).toHaveProperty('nom')
      expect(groupe).toHaveProperty('participants')
      expect(groupe).toHaveProperty('groupeVisibility')
      expect(groupe).toHaveProperty('messages')
    })
  })
})
