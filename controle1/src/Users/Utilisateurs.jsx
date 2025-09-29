import { useState, useEffect, useRef, useMemo } from 'react'

// Normalisation d'un utilisateur
function normaliserUtilisateur(utilisateur, index) {
  return {
    id: utilisateur.id ?? index,
    nom: utilisateur.username ?? `Utilisateur${index}`,
    statut: utilisateur.online_status ?? 'offline',
    avatar: utilisateur.avatar ?? null,
  }
}

// Ligne d'utilisateur
function LigneUtilisateur({ utilisateur, estUtilisateurActuel }) {
  const { nom, statut, avatar } = utilisateur
  const initiale = nom?.[0]?.toUpperCase() ?? '?'

  return (
    <div className={`utilisateur-ligne ${estUtilisateurActuel ? 'moi' : ''}`}>
      <span className={`statut ${statut}`} />
      {avatar ? (
        <img className="avatar" src={avatar} alt={`Avatar de ${nom}`} />
      ) : (
        <div className="avatar">{initiale}</div>
      )}
      <div className="nom">{nom}</div>
    </div>
  )
}

function Utilisateurs({ utilisateurs, setUtilisateurs, utilisateurActuel }) {
  const containerRef = useRef(null)

  // Ref pour garder les derniers utilisateurs à jour dans le scroll listener
  const utilisateursRef = useRef(utilisateurs)
  utilisateursRef.current = utilisateurs

  const isFetchingRef = useRef(false) // Pour éviter les fetchs simultanés
  const dernierFetchIdRef = useRef(
    utilisateurs.length > 0 ? utilisateurs[utilisateurs.length - 1].id : null
  )

  // Scroll listener
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const fetchNextUsers = async (lastId) => {
      if (isFetchingRef.current || dernierFetchIdRef.current === lastId) return

      isFetchingRef.current = true
      dernierFetchIdRef.current = lastId

      try {
        const res = await fetch(`http://localhost:3000/users/next/${lastId}`)
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`)
        const result = await res.json()
        if (result.length > 0) {
          setUtilisateurs((prev) => [...prev, ...result])
        }
      } catch (err) {
        console.error('Erreur fetch users:', err)
      } finally {
        isFetchingRef.current = false
      }
    }

    const onScroll = () => {
      const lastUtilisateur =
        utilisateursRef.current[utilisateursRef.current.length - 1]
      if (!lastUtilisateur) return

      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 5
      ) {
        fetchNextUsers(lastUtilisateur.id)
      }
    }

    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [setUtilisateurs])

  // Normalisation mémorisée
  const listeUtilisateurs = useMemo(() => {
    return Array.isArray(utilisateurs)
      ? utilisateurs.map(normaliserUtilisateur)
      : []
  }, [utilisateurs])

  return (
    <div id="sidebar_Utilisateurs" ref={containerRef}>
      {listeUtilisateurs.map((u) => (
        <LigneUtilisateur
          key={u.id}
          utilisateur={u}
          estUtilisateurActuel={u.nom === utilisateurActuel}
        />
      ))}
    </div>
  )
}

export default Utilisateurs
