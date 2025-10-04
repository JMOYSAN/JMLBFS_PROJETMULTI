import { useEffect, useState, useRef } from 'react'

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
  const [currentGroupe, setCurrentGroupe] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isConnect, setIsConnect] = useState(false)
  const [page, setPage] = useState('login')

  const ws = useRef(null)

  // Charger les utilisateurs depuis l’API
  useEffect(() => {
    fetch(`http://localhost:3000/users`)
      .then((res) => res.json())
      .then((result) => setUtilisateurs(result))
      .catch((error) => console.error(error))
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
    if (ws.current) ws.current.close()
  }

  // WebSocket
  useEffect(() => {
    if (!isConnect || !currentUser) return

    ws.current = new WebSocket(`ws://localhost:3000?user=${currentUser.id}`)

    ws.current.onopen = () => console.log('Connected to WebSocket')
    ws.current.onclose = () => console.log('WebSocket closed')

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'message') {
        setGroupes((prev) =>
          prev.map((g) =>
            g.id === data.group_id
              ? { ...g, messages: [...(g.messages || []), data] }
              : g
          )
        )
      }

      // NEW: update the active group if it matches
      setCurrentGroupe((prev) => {
        if (prev && prev.id === data.group_id) {
          return { ...prev, messages: [...(prev.messages || []), data] }
        }
        return prev
      })
    }

    return () => ws.current && ws.current.close()
  }, [isConnect, currentUser])

  // Récupérer les anciens messages du groupe sélectionné
  useEffect(() => {
    if (!currentGroupe?.id) return

    fetch(`http://localhost:3000/messages/group/${currentGroupe.id}`)
      .then((res) => res.json())
      .then((data) => {
        setGroupes((prev) =>
          prev.map((g) =>
            g.id === currentGroupe.id ? { ...g, messages: data } : g
          )
        )
      })
      .catch((err) => console.error('Erreur récupération messages:', err))
  }, [currentGroupe?.id])

  // Envoyer un message via WebSocket
  const gererNouveauMessageFichier = (contenu) => {
    if (!currentGroupe || !currentUser || !contenu.message?.trim()) return

    const message = {
      type: 'message',
      content: contenu.message,
      user_id: currentUser.id,
      group_id: currentGroupe.id,
    }

    ws.current?.send(JSON.stringify(message))

    setGroupes((prev) =>
      prev.map((g) =>
        g.id === currentGroupe.id
          ? { ...g, messages: [...(g.messages || []), message] }
          : g
      )
    )
  }

  // Créer un nouveau groupe localement
  const creerNouveauGroupe = (
    nomGroupe,
    participantsAjoutes,
    groupeVisibility
  ) => {
    const formaterParticipant = (nom) => ({ nom, isTyping: false })
    const groupe = {
      id: crypto.randomUUID?.() || Date.now(),
      nom: nomGroupe,
      participants: [
        ...participantsAjoutes.map(formaterParticipant),
        formaterParticipant(currentUser),
      ],
      messages: [],
      groupeVisibility,
    }
    setGroupes((prev) => [...prev, groupe])
    setShowForm(false)
  }

  // Modifier les participants d’un groupe
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

  // Gestion du thème clair/sombre
  useEffect(() => {
    if (currentUser?.theme === 'light') document.body.classList.add('light')
    else document.body.classList.remove('light')
  }, [currentUser])

  // Restaurer utilisateur depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setCurrentUser(JSON.parse(stored))
      setIsConnect(true)
    }
  }, [])

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
        <Login onLogin={gererNouveauUtilisateur} setPage={setPage} />
      ) : (
        <Register onRegister={() => setPage('login')} setPage={setPage} />
      )}
    </>
  )
}

export default App
