import { useEffect, useRef } from 'react'
import { useUsers } from '../hooks/useUsers'
import { useAuth } from '../hooks/useAuth.js'
import { useGroups } from '../hooks/useGroups.js'

// Ligne d'utilisateur
function LigneUtilisateur({ utilisateur, estUtilisateurActuel }) {
  const { nom, statut, avatar } = utilisateur
  const initiale = nom?.[0]?.toUpperCase() ?? '?'
  const { currentUser } = useAuth()
  const { creerGroupe } = useGroups(currentUser)
  const { normalizedUsers } = useUsers()

  const handleClick = async () => {
    if (estUtilisateurActuel) return

    try {
      const groupName = `${currentUser.username} & ${nom}`
      await creerGroupe(groupName, [nom], true, normalizedUsers)
      console.log(`Groupe créé avec ${nom}`)
    } catch (error) {
      console.error('Erreur création groupe:', error)
    }
  }
  return (
    <button
      className={`utilisateur-ligne ${estUtilisateurActuel ? 'moi' : ''}`}
      onClick={handleClick}
      disabled={estUtilisateurActuel}
    >
      <span className={`statut ${statut}`} />
      {avatar ? (
        <img className="avatar" src={avatar} alt={`Avatar de ${nom}`} />
      ) : (
        <div className="avatar">{initiale}</div>
      )}
      <div className="nom">{nom}</div>
    </button>
  )
}

function Utilisateurs({ utilisateurActuel }) {
  const containerRef = useRef(null)

  // Hook utilisateurs avec lazy loading intégré
  const { normalizedUsers, loadMoreUsers, hasMore, pending } = useUsers()

  // Ref pour accéder aux dernières données dans le scroll listener
  const usersRef = useRef(normalizedUsers)
  usersRef.current = normalizedUsers

  // Scroll listener pour lazy loading
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onScroll = () => {
      const lastUtilisateur = usersRef.current[usersRef.current.length - 1]
      if (!lastUtilisateur || !hasMore || pending) return

      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 5
      ) {
        loadMoreUsers(lastUtilisateur.id)
      }
    }

    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [loadMoreUsers, hasMore, pending])

  return (
    <div id="sidebar_Utilisateurs" ref={containerRef}>
      {normalizedUsers.map((u) => (
        <LigneUtilisateur
          key={u.id}
          utilisateur={u}
          estUtilisateurActuel={u.nom === utilisateurActuel}
        />
      ))}
      {pending && <p className="loading">Chargement...</p>}
    </div>
  )
}

export default Utilisateurs
