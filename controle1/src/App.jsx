import { useEffect, useState } from 'react'

import FilsConversation from './Messages/FilsConversation'
import Login from './Users/Login'

import Sidebar from './Components/Sidebar.jsx'
import Utilisateurs from './Users/Utilisateurs.jsx'
import getGroupes from './Mock/MockGroupe.js'
import Register from './Users/Register.jsx'

function App() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [currentUser, setCurrentUser] = useState()
  const [groupes, setGroupes] = useState(getGroupes())
  const [currentGroupe, setCurrentGroupe] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [isConnect, setIsConnect] = useState(false)

  const [page, setPage] = useState('login')

  // Charger les utilisateurs depuis l’API
  useEffect(() => {
    fetch(`http://localhost:3000/users`)
      .then((res) => res.json())
      .then(
        (result) => setUtilisateurs(result),
        (error) => console.log(error)
      )
  }, [])

  // Connexion réussie
  const gererNouveauUtilisateur = (nouveauUtilisateur) => {
    setCurrentUser(nouveauUtilisateur)
    localStorage.setItem('user', JSON.stringify(nouveauUtilisateur))
    setIsConnect(true)
  }

  // Déconnexion
  const handleLogout = () => {
    localStorage.clear()
    setCurrentUser(null)
    setCurrentGroupe(null)
    setIsConnect(false)
    setPage('login')
  }

  // Nouveau message
  const gererNouveauMessageFichier = (contenu) => {
    if (
      !currentGroupe ||
      !currentUser ||
      (!contenu.message?.trim() && !contenu.fichier)
    )
      return

    const nouveauMessage = {
      id: crypto.randomUUID?.() || `${Date.now()}`,
      texte: contenu.message || '',
      fichier: contenu.fichier || null,
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

      const groupeMisAJour = nouveauxGroupes.find(
        (g) => g.nom === currentGroupe.nom
      )
      setCurrentGroupe(groupeMisAJour)

      return nouveauxGroupes
    })
  }

  // Créer un nouveau groupe
  const creerNouveauGroupe = (
    nomGroupe,
    participantsAjoutes,
    groupeVisibility
  ) => {
    const formaterParticipant = (nom) => ({
      nom: nom,
      isTyping: false,
    })

    const groupe = {
      nom: nomGroupe,
      participants: [
        ...participantsAjoutes.map(formaterParticipant),
        formaterParticipant(currentUser),
      ],
      messages: [],
      groupeVisibility: groupeVisibility,
    }

    setGroupes((prev) => [...prev, groupe])
    setShowForm(false)
  }

  const modifierGroupe = (listeParticipants = []) => {
    const getNom = (u) => (typeof u === 'string' ? u : u?.username || '')
    const normalise = (nom) => ({ nom, isTyping: false })

    setGroupes((prev) =>
      prev.map((g) => {
        if (g.nom !== currentGroupe?.nom) return g

        const existants = new Set(
          (g.participants || []).map((p) => getNom(p).toLowerCase())
        )
        const ajouts = (listeParticipants || [])
          .map(getNom)
          .filter(Boolean)
          .filter((n) => !existants.has(n.toLowerCase()))
          .map(normalise)

        const maj = {
          ...g,
          participants: [...(g.participants || []), ...ajouts],
        }
        setCurrentGroupe(maj)
        return maj
      })
    )
  }

  // Restaurer utilisateur en mémoire
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
      setIsConnect(true)
    }
  }, [])

  // Gestion thème clair/sombre
  useEffect(() => {
    if (currentUser?.theme === 'light') {
      document.body.classList.add('light')
    } else {
      document.body.classList.remove('light')
    }
  }, [currentUser])
  //console.log('Page actuelle:', page, 'isConnect:', isConnect)
  //console.log('Tous les groupes:', groupes)
  return (
    <>
      {isConnect ? (
        <div id="chat-container">
          <Utilisateurs
            onLogout={handleLogout}
            showFormCreerGroupe={setShowForm}
            showForm={showForm}
            utilisateurs={utilisateurs}
            setUtilisateurs={setUtilisateurs}
            onClose={creerNouveauGroupe}
            setCurrentGroupe={setCurrentGroupe}
            groupes={groupes}
            currentUser={currentUser}
          />
          <Sidebar
            onLogout={handleLogout}
            showFormCreerGroupe={setShowForm}
            showForm={showForm}
            setShowForm={setShowForm}
            utilisateurs={utilisateurs}
            onClose={creerNouveauGroupe}
            setCurrentGroupe={setCurrentGroupe}
            groupes={groupes}
            currentUser={currentUser}
            currentGroupe={currentGroupe}
          />
          <FilsConversation
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            currentGroupe={currentGroupe}
            onSend={gererNouveauMessageFichier}
            utilisateurs={utilisateurs}
            onClose={modifierGroupe}
            setGroupes={setGroupes}
            setCurrentGroupe={setCurrentGroupe}
          />
        </div>
      ) : page === 'login' ? (
        <>
          <Login onLogin={gererNouveauUtilisateur} setPage={setPage} />
        </>
      ) : (
        <>
          <Register onRegister={() => setPage('login')} setPage={setPage} />
        </>
      )}
    </>
  )
}

export default App
