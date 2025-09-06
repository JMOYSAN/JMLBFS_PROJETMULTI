function genererGroupes() {
  return [
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
}

export default genererGroupes
