import { useState, useEffect, useRef } from 'react'
import FormCreerGroupe from '../Form/FormCreerGroupe.jsx'
import Groupe from '../Groupes/Groupe.jsx'
import Logout from './Logout.jsx'
import AddGroup from '../Groupes/AddGroup.jsx'

function Sidebar({
  onLogout,
  showFormCreerGroupe,
  showForm,
  utilisateurs,
  onClose,
  groupesUser,
  groupesPublic,
  setCurrentGroupe,
  currentUser,
}) {
  const [visibleUserCount, setVisibleUserCount] = useState(17)
  const [visiblePublicCount, setVisiblePublicCount] = useState(17)
  const userContainerRef = useRef(null)
  const publicContainerRef = useRef(null)

  useEffect(() => {
    const userContainer = userContainerRef.current
    if (!userContainer) return

    const onUserScroll = () => {
      if (
        userContainer.scrollTop + userContainer.clientHeight >=
        userContainer.scrollHeight - 5
      ) {
        setVisibleUserCount((prev) => prev + 5)
      }
    }

    userContainer.addEventListener('scroll', onUserScroll)
    return () => userContainer.removeEventListener('scroll', onUserScroll)
  }, [])

  useEffect(() => {
    const publicContainer = publicContainerRef.current
    if (!publicContainer) return

    const onPublicScroll = () => {
      if (
        publicContainer.scrollTop + publicContainer.clientHeight >=
        publicContainer.scrollHeight - 5
      ) {
        setVisiblePublicCount((prev) => prev + 5)
      }
    }

    publicContainer.addEventListener('scroll', onPublicScroll)
    return () => publicContainer.removeEventListener('scroll', onPublicScroll)
  }, [])

  return (
    <div id="sidebar">
      {showForm ? (
        <FormCreerGroupe
          utilisateurs={utilisateurs}
          onClose={onClose}
          currentUser={currentUser}
          showFormCreerGroupe={showFormCreerGroupe}
        />
      ) : (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <AddGroup showFormCreerGroupe={showFormCreerGroupe} />
            <Logout onLogout={onLogout} />
          </div>

          <div className="sidebar-groups">
            <div
              className="group-section"
              ref={userContainerRef}
              style={{ maxHeight: '300px', overflowY: 'auto' }}
            >
              <h3>Vos Groupes</h3>
              {groupesUser.slice(0, visibleUserCount).map((g) => (
                <Groupe
                  key={g.id}
                  currentUser={currentUser}
                  groupe={g}
                  setCurrentGroupe={setCurrentGroupe}
                />
              ))}
            </div>

            <div
              className="group-section"
              ref={publicContainerRef}
              style={{ maxHeight: '300px', overflowY: 'auto' }}
            >
              <h3>Groupes disponibles</h3>
              {groupesPublic.slice(0, visiblePublicCount).map((g) => (
                <Groupe
                  key={g.id}
                  currentUser={currentUser}
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
