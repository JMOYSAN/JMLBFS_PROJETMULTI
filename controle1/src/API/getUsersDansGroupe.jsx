// groupService.js (for example)

export const getGroupUsers = async (groupId) => {
  try {
    const res = await fetch(`http://localhost:3000/groups-users/${groupId}`)
    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status}`)
    }
    const members = await res.json()
    console.log('Membres du groupe:', members)
    return members
  } catch (err) {
    console.error('Erreur récupération membres du groupe:', err)
    return []
  }
}
