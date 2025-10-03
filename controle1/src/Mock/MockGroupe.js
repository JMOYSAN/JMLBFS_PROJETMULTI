// Les mocks ont été écrits par ChatGPT

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
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: i + 6,
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
  return groupes
}

export default genererGroupes
