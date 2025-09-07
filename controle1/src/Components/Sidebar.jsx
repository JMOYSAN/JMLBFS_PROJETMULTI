import { useState, useEffect, useRef } from 'react'
import FormCreerGroupe from '../Form/FormCreerGroupe.jsx'
import Groupe from './Groupe.jsx'
import Logout from './Logout.jsx'
import AddGroup from './AddGroup.jsx'

function Sidebar({
  onLogout,
  showFormCreerGroupe,
  showForm,
  utilisateurs,
  onClose,
  groupes,
  setCurrentGroupe,
  currentUser,
}) {
  const groupesFiltrer = groupes.filter((g) =>
    g.participants.some((p) => p.nom === currentUser)
  )
  console.log('groupesFiltre:', groupesFiltrer)

  const groupesSansUser = groupes.filter(
    (g) =>
      !g.participants.some((p) => p.nom === currentUser) &&
      g.groupeVisibility === 'public'
  )

  const [visibleCount, setVisibleCount] = useState(17)
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 5
      ) {
        setVisibleCount((prev) => prev + 5)
      }
    }

    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div id="sidebar">
      {showForm ? (
        <FormCreerGroupe
          utilisateurs={utilisateurs}
          onClose={onClose}
          currentUser={currentUser}
        />
      ) : (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <AddGroup showFormCreerGroupe={showFormCreerGroupe} />
            <Logout onLogout={onLogout} />
          </div>

          <div className="sidebar-groups" ref={containerRef}>
            <div className="group-section">
              <h3>Vos Groupes</h3>
              {groupesFiltrer.slice(0, visibleCount).map((g) => (
                <Groupe
                  key={g.id}
                  groupe={g}
                  setCurrentGroupe={setCurrentGroupe}
                />
              ))}
            </div>

            <div className="group-section">
              <h3>Groupes disponibles</h3>
              {groupesSansUser.slice(0, visibleCount).map((g) => (
                <Groupe
                  key={g.id}
                  groupe={g}
                  setCurrentGroupe={setCurrentGroupe}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
