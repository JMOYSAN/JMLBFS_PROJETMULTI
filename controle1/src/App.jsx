import { useEffect, useState } from 'react'

import FilsConversation from './Messages/FilsConversation'
import Login from './Users/Login'
import Sidebar from './Components/Sidebar.jsx'
import genererUtilisateurs from './Mock/MockUtilisateurs.js'
import Utilisateurs from './Users/Utilisateurs.jsx'
import genererGroupes from './Mock/MockGroupe.js'

function App() {
  const [utilisateurs, setUtilisateurs] = useState(genererUtilisateurs())

  const [currentUser, setCurrentUser] = useState()

  const [groupes, setGroupes] = useState(genererGroupes())

  const [currentGroupe, setCurrentGroupe] = useState([])

  const gererNouveauUtilisateur = (nouveauUtilisateur) => {
    const utilisateurExistant = utilisateurs.find(
      (u) => u.nom === nouveauUtilisateur.nom
    )

    if (!utilisateurExistant) {
      setUtilisateurs((prev) => [...prev, nouveauUtilisateur])
      setCurrentUser(nouveauUtilisateur)
      localStorage.setItem('user', JSON.stringify(nouveauUtilisateur))
    } else {
      setCurrentUser(utilisateurExistant)
      localStorage.setItem('user', JSON.stringify(utilisateurExistant))
    }

    console.log(
      'currentUser:',
      JSON.stringify(utilisateurExistant || nouveauUtilisateur, null, 2)
    )
    setIsConnect(true)
  }

  const gererNouveauMessage = (texte) => {
    if (!currentGroupe || !currentUser || !texte.trim()) return

    const nouveauMessage = {
      id: (crypto.randomUUID && crypto.randomUUID()) || `${Date.now()}`,
      texte: texte,
      auteur: currentUser,
      date: new Date().toLocaleString([], {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setGroupes((prevGroupes) => {
      const nouveauxGroupes = prevGroupes.map((groupe) =>
        groupe.nom === currentGroupe.nom
          ? {
              ...groupe,
              messages: [...(groupe.messages || []), nouveauMessage],
            }
          : groupe
      )

      // Mettre à jour currentGroupe pour que le chat se rafraîchisse
      const groupeMisAJour = nouveauxGroupes.find(
        (g) => g.nom === currentGroupe.nom
      )
      setCurrentGroupe(groupeMisAJour)

      return nouveauxGroupes
    })
  }

  const handleLogout = () => {
    localStorage.clear()
    setCurrentUser(null)
    setCurrentGroupe(null)
    setIsConnect(false)
  }
  const [showForm, setShowForm] = useState(false)

  const showFormCreerGroupe = () => {
    setShowForm(true)
  }

  const creerNouveauGroupe = (
    nomGroupe,
    participantsAjoutes,
    groupeVisibility
  ) => {
    const groupe = {
      nom: nomGroupe,
      participants: [...participantsAjoutes, currentUser],
      messages: [],
      groupeVisibility: groupeVisibility,
    }
    setGroupes((prev) => [...prev, groupe])
    setShowForm(false)
  }

  const [isConnect, setIsConnect] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
      setIsConnect(true)
    }
  }, [])
  return (
    <>
      {isConnect ? (
        <>
          <div id="chat-container">
            <Utilisateurs
              onLogout={handleLogout}
              showFormCreerGroupe={showFormCreerGroupe}
              showForm={showForm}
              utilisateurs={utilisateurs}
              onClose={creerNouveauGroupe}
              setCurrentGroupe={setCurrentGroupe}
              groupes={groupes}
              currentUser={currentUser}
            />
            <Sidebar
              onLogout={handleLogout}
              showFormCreerGroupe={showFormCreerGroupe}
              showForm={showForm}
              utilisateurs={utilisateurs}
              onClose={creerNouveauGroupe}
              setCurrentGroupe={setCurrentGroupe}
              groupes={groupes}
              currentUser={currentUser}
            />

            <FilsConversation
              currentUser={currentUser}
              currentGroupe={currentGroupe}
              onSend={gererNouveauMessage}
            />
          </div>
        </>
      ) : (
        <Login onLogin={gererNouveauUtilisateur} />
      )}
    </>
  )
}

export default App
