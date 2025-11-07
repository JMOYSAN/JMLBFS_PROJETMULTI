function normaliserGroupes(apiGroups) {
  return apiGroups.map((g, index) => ({
    nom: g.name || `Groupe ${index + 1}`,
    participants: [],
    groupeVisibility: g.is_private ? 'private' : 'public',
    messages: [],
  }))
}
export default normaliserGroupes
