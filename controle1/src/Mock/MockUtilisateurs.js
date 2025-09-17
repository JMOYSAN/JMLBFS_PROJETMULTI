async function genererUtilisateurs() {
  try {
    const response = await fetch(`http://localhost:3000/users`)
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

export async function getUtilisateursLazy(id) {
  try {
    const response = await fetch(`http://localhost:3000/users/next/${id}`)
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
