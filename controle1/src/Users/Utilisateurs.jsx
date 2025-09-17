import { useState, useEffect, useRef } from 'react'
import {getUtilisateursLazy} from "../Mock/MockUtilisateurs.js";
function normaliserUtilisateur(utilisateur, index) {
  if (typeof utilisateur === 'string') {
    return { id: index, nom: utilisateur, statut: 'hors-ligne', avatar: null }
  }
  return {
    id: utilisateur.id ?? index,
    nom: utilisateur.username ?? utilisateur.nom ?? 'Utilisateur',
    statut: utilisateur.statut ?? 'hors-ligne',
    avatar: utilisateur.avatar ?? null,
  }
}

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

function Utilisateurs({ utilisateurs, setUtilisateur, utilisateurActuel }) {
  const listeUtilisateurs = Array.isArray(utilisateurs)
    ? utilisateurs.map((utilisateur, index) =>
        normaliserUtilisateur(utilisateur, index)
      )
    : []

  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 5
      ) {
        setUtilisateur((prev) => [...prev, getUtilisateursLazy(utilisateurs[utilisateurs.length - 1].id)])
      }
    }

    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div id="sidebar_Utilisateurs" ref={containerRef}>
      {listeUtilisateurs.map((utilisateur) => (
        <LigneUtilisateur
          key={utilisateur.id}
          utilisateur={utilisateur}
          estUtilisateurActuel={utilisateur.nom === utilisateurActuel}
        />
      ))}
    </div>
  )
}

export default Utilisateurs
