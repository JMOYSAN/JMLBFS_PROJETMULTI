// src/App.jsx
import { useState } from 'react'
import FilsConversation from './Messages/FilsConversation'
import Login from './Users/Login'
import Sidebar from './components/Sidebar.jsx'
import Utilisateurs from './Users/Utilisateurs.jsx'
import Register from './Users/Register.jsx'

import { useAuth } from './contexts/AuthContext'
import { useUsers } from './hooks/useUsers'
import { useGroups } from './hooks/useGroups'

//TEST

function App() {
  const [showForm, setShowForm] = useState(false)
  const [page, setPage] = useState('login')

  const { currentUser, setCurrentUser, isConnect, logout } = useAuth()
  const { utilisateurs, setUtilisateurs } = useUsers()
  const {
    groupes,
    setGroupes,
    currentGroupe,
    setCurrentGroupe,
    creerGroupe,
    addMemberToGroupe,
  } = useGroups(currentUser)

  const handleLogout = () => {
    logout()
    setCurrentGroupe(null)
    setPage('login')
  }

  const creerNouveauGroupe = async (
    nomGroupe,
    participantsAjoutes,
    groupeVisibility
  ) => {
    try {
      const isPrivate = groupeVisibility === 'private'
      await creerGroupe(nomGroupe, participantsAjoutes, isPrivate, utilisateurs)
      setShowForm(false)
    } catch (err) {
      console.error('Erreur création groupe:', err)
      // alert('Erreur lors de la création du groupe')
    }
  }

  const modifierGroupe = async (listeParticipants = []) => {
    if (!currentGroupe?.id) return
    const getNom = (u) => (typeof u === 'string' ? u : u?.username || '')
    try {
      for (const participant of listeParticipants) {
        const nom = getNom(participant)
        const user = utilisateurs.find((u) => getNom(u) === nom)
        if (user) {
          await addMemberToGroupe(user.id, currentGroupe.id)
        }
      }
    } catch (err) {
      console.error('Erreur modification groupe:', err)
    }
  }

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
            setGroupes={setGroupes}
            currentUser={currentUser}
            currentGroupe={currentGroupe}
          />
          <FilsConversation
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            currentGroupe={currentGroupe}
            utilisateurs={utilisateurs}
            onClose={modifierGroupe}
            setGroupes={setGroupes}
            setCurrentGroupe={setCurrentGroupe}
          />
        </div>
      ) : page === 'login' ? (
        <Login setPage={setPage} />
      ) : (
        <Register onRegister={() => setPage('login')} setPage={setPage} />
      )}
    </>
  )
}

export default App
