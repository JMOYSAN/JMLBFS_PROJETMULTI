import { useEffect, useRef, useMemo } from 'react'
import Groupe from '../Groupes/Groupe.jsx'
import { normalizeGroup } from '../services/groupService'

function SectionGroupes({
  titre,
  type,
  groupes,
  loadMoreGroups,
  currentUser,
  setCurrentGroupe,
}) {
  const containerRef = useRef(null)
  const groupesRef = useRef(groupes)
  groupesRef.current = groupes

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onScroll = () => {
      const lastGroupe = groupesRef.current[groupesRef.current.length - 1]
      if (!lastGroupe) return

      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 5
      ) {
        loadMoreGroups(type, lastGroupe.id)
      }
    }

    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [loadMoreGroups, type])

  const listeGroupes = useMemo(() => {
    return Array.isArray(groupes) ? groupes.map(normalizeGroup) : []
  }, [groupes])

  return (
    <>
      <h3>{titre}</h3>
      <div className="group-section" ref={containerRef}>
        {listeGroupes.map((g) => (
          <Groupe
            key={g.id}
            groupe={g}
            currentUser={currentUser}
            setCurrentGroupe={setCurrentGroupe}
          />
        ))}
      </div>
    </>
  )
}

function GroupesSidebar({
  groupes,
  loadMoreGroups,
  currentUser,
  setCurrentGroupe,
}) {
  return (
    <div className="sidebar-groups">
      <SectionGroupes
        titre="Groupes publics"
        type="public"
        groupes={groupes.public}
        loadMoreGroups={loadMoreGroups}
        currentUser={currentUser}
        setCurrentGroupe={setCurrentGroupe}
      />
      <SectionGroupes
        titre="Groupes privés"
        type="private"
        groupes={groupes.private}
        loadMoreGroups={loadMoreGroups}
        currentUser={currentUser}
        setCurrentGroupe={setCurrentGroupe}
      />
    </div>
  )
}

export default GroupesSidebar
