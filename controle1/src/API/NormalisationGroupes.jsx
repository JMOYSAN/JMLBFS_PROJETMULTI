function normaliserGroupes(apiGroups) {
  return apiGroups.map((g, index) => ({
    nom: g.name || `Groupe ${index + 1}`,
    participants: [], // tu peux remplir après avec ton API users/groupes
    groupeVisibility: g.is_private ? 'private' : 'public',
    messages: [],
  }))
}
export default normaliserGroupes
