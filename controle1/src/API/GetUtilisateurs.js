const API_URL = import.meta.env.VITE_API_URL

async function genererUtilisateurs() {
  try {
    const response = await fetch(`${API_URL}/users`)
    if (response) {
      console.log('Res ', response)
    }
    const users = await response.json()
    return users
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error)
    return null
  }
}

export async function getUtilisateursById(id) {
  try {
    const response = await fetch(`${API_URL}/users/next/${id}`)
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    const users = await response.json()
    return users
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error)
    return null
  }
}

export default genererUtilisateurs
