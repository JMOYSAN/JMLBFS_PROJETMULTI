import { useEffect, useRef, useMemo } from 'react'

// Normalisation d’un groupe
function normaliserGroupe(groupe, index) {
  return {
    id: groupe.id ?? index,
    nom: groupe.name ?? `Groupe${index}`,
    type: groupe.type ?? 'public', // "public" ou "prive"
  }
}

// Ligne d’un groupe
function LigneGroupe({ groupe }) {
  return (
    <div className="groupe">
      <span className="icon">#</span>
      <div className="nom">{groupe.nom}</div>
    </div>
  )
}

// Composant générique pour une section de groupes (lazy loading)
function SectionGroupes({ titre, type, groupes, setGroupes }) {
  const containerRef = useRef(null)
  const groupesRef = useRef(groupes)
  groupesRef.current = groupes

  const isFetchingRef = useRef(false)
  const dernierFetchIdRef = useRef(
    groupes.length > 0 ? groupes[groupes.length - 1].id : null
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const fetchNextGroupes = (lastId) => {
      if (isFetchingRef.current || dernierFetchIdRef.current === lastId) return
      isFetchingRef.current = true
      dernierFetchIdRef.current = lastId

      fetch(`http://localhost:3000/groupes/next/${type}/${lastId}?limit=20`)
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
        })
        .catch((err) => {
          console.error('Erreur fetch groupes:', err)
        })
        .finally(() => {
          isFetchingRef.current = false
        })
    }

    const onScroll = () => {
      const lastGroupe = groupesRef.current[groupesRef.current.length - 1]
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

  return (
    <div className="group-section" ref={containerRef}>
      <h3>{titre}</h3>
      {listeGroupes.map((g) => (
        <LigneGroupe key={g.id} groupe={g} />
      ))}
    </div>
  )
}

// Sidebar avec deux sections (public et privé)
function GroupesSidebar({ groupes, setGroupes }) {
  return (
    <div className="sidebar-groups">
      <SectionGroupes
        titre="Groupes publics"
        type="public"
        groupes={groupes}
        setGroupes={setGroupes}
      />
    </div>
  )
}

export default GroupesSidebar
