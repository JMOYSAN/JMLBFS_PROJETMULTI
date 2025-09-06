const currentUser = 'Frank'

function genererGroupes() {
  const groupes = [
    {
      nom: 'Groupe 1',
      participants: [
        { nom: 'Alice', isTyping: false },
        { nom: 'Bob', isTyping: false },
        { nom: 'Charlie', isTyping: false },
      ],
      groupeVisibility: 'public',
      messages: [],
    },
    {
      nom: 'Groupe 2',
      participants: [
        { nom: 'Diana', isTyping: false },
        { nom: 'Eve', isTyping: true },
        { nom: 'Frank', isTyping: false },
        { nom: 'Grace', isTyping: false },
      ],
      groupeVisibility: 'private',
      messages: [],
    },
    {
      nom: 'Groupe 3',
      participants: [
        { nom: 'William', isTyping: true },
        { nom: 'Ivan', isTyping: false },
        { nom: 'Judy', isTyping: true },
        { nom: 'Karl', isTyping: false },
      ],
      groupeVisibility: 'private',
      messages: [],
    },
    {
      nom: 'Groupe 4',
      participants: [
        { nom: 'Laura', isTyping: false },
        { nom: 'Oliver Fortin', isTyping: false },
        { nom: 'Lyam', isTyping: false },
      ],
      groupeVisibility: 'private',
      messages: [],
    },
    {
      nom: 'Groupe 5',
      participants: [
        { nom: 'Olivia', isTyping: false },
        { nom: 'Simon', isTyping: false },
        { nom: 'Quentin', isTyping: false },
      ],
      groupeVisibility: 'public',
      messages: [],
    },
    ...Array.from({ length: 25 }, (_, i) => ({
      nom: `Groupe ${i + 6}`,
      participants: [
        { nom: 'Rupert', isTyping: false },
        { nom: 'Mathurin', isTyping: false },
        { nom: 'Joaquim', isTyping: false },
      ],
      groupeVisibility: 'public',
      messages: [],
    })),
  ]

  // Ajouter 30 messages à Groupe 1
  const groupe2 = groupes[1]
  for (let i = 1; i <= 30; i++) {
    const texte = `Message ${i} de Frank`
    groupe2.messages.push({
      id: (crypto.randomUUID && crypto.randomUUID()) || `${Date.now()}-${i}`,
      texte: texte,
      auteur: currentUser,
      date: new Date().toLocaleString([], {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    })
  }
  console.log('groupe', groupes)
  return groupes
}

export default genererGroupes
