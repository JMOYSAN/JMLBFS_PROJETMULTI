import { useState, useEffect, useRef, useMemo } from 'react'
import Groupe from '../Groupes/Groupe.jsx'

// Normalisation d’un groupe
function normaliserGroupe(groupe, index) {
  return {
    id: groupe.id ?? index,
    nom: groupe.name ?? `Groupe${index}`,
    type: groupe.is_private ? 'private' : 'public',
  }
}

// Composant générique pour une section de groupes (lazy loading)
function SectionGroupes({
  titre,
  type,
  groupes,
  setGroupes,
  currentGroupe,
  currentUser,
  setCurrentGroupe,
}) {
  const containerRef = useRef(null)
  const groupesRef = useRef(groupes)
  groupesRef.current = groupes

  const isFetchingRef = useRef(false)
  const dernierFetchIdRef = useRef(
    groupes && groupes.length > 0 ? groupes[groupes.length - 1].id : null
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const fetchNextGroupes = (lastId) => {
      if (isFetchingRef.current || dernierFetchIdRef.current === lastId) return
      isFetchingRef.current = true
      dernierFetchIdRef.current = lastId

      fetch(`http://localhost:3000/groups/next/${type}/${lastId}?limit=20`)
        .then((res) => {
          if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`)
          return res.json()
        })
        .then((result) => {
          if (Array.isArray(result) && result.length > 0) {
            setGroupes((prev) => ({
              ...prev,
              [type]: [...prev[type], ...result],
            }))
          }
          console.log('RESULT', result)
        })
        .catch((err) => {
          console.error('Erreur fetch groupes:', err)
        })
        .finally(() => {
          isFetchingRef.current = false
        })
    }

    const onScroll = () => {
      const lastGroupe =
        groupesRef.current && groupesRef.current[groupesRef.current.length - 1]
      if (!lastGroupe) return

      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 5
      ) {
        fetchNextGroupes(lastGroupe.id)
      }
    }

    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [setGroupes, type])

  const listeGroupes = useMemo(() => {
    return Array.isArray(groupes) ? groupes.map(normaliserGroupe) : []
  }, [groupes])
  console.log('ListeGroupes:', listeGroupes)
  return (
    <div className="group-section" ref={containerRef}>
      <h3>{titre}</h3>
      {listeGroupes.map((g) => (
        <Groupe
          key={g.id}
          groupe={g}
          currentUser={currentUser}
          setGroupes={setGroupes}
          setCurrentGroupe={setCurrentGroupe}
        ></Groupe>
      ))}
    </div>
  )
}

function GroupesSidebar({ currentUser, setCurrentGroupe }) {
  const [groupes, setGroupes] = useState({ public: [], private: [] })

  useEffect(() => {
    console.log('RESULT', currentUser)
    fetch(`http://localhost:3000/groups/private/${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('PRIVATE', data)
        setGroupes((prev) => ({
          ...prev,
          private: data,
        }))
      })
      .catch((err) => console.error('Erreur fetch groupes init:', err))
  }, [])

  useEffect(() => {
    fetch('http://localhost:3000/groups/public')
      .then((res) => res.json())
      .then((data) => {
        // le backend renvoie un tableau brut
        console.log('PUBLIC', data)

        setGroupes((prev) => ({
          ...prev,
          public: data,
        }))
      })
      .catch((err) => console.error('Erreur fetch groupes init:', err))
  }, [])
  return (
    <div className="sidebar-groups">
      <SectionGroupes
        titre="Groupes publics"
        type="public"
        groupes={groupes.public}
        setGroupes={setGroupes}
        currentUser={currentUser}
        setCurrentGroupe={setCurrentGroupe}
      />
      <SectionGroupes
        titre="Groupes privés"
        type="private"
        groupes={groupes.private}
        setGroupes={setGroupes}
        currentUser={currentUser}
        setCurrentGroupe={setCurrentGroupe}
      />
    </div>
  )
}

export default GroupesSidebar
