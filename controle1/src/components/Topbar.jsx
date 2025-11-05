import { useEffect, useState } from 'react'
import AjouterDansGroupe from '../Groupes/AjouterDansGroupe.jsx'
import AddGroup from '../Groupes/AddGroup.jsx'
import { useAuth } from '../hooks/useAuth'
import { useGroups } from '../hooks/useGroups'

function Topbar({
  utilisateurs = [],
  currentGroupe,
  currentUser,
  onClose,
  setCurrentGroupe,
  setGroupes,
}) {
  const [showAjouterDansGroupe, setshowAjouterDansGroupe] = useState(false)
  const [members, setMembers] = useState([])

  const { toggleTheme } = useAuth()
  const { loadGroupMembers } = useGroups(currentUser)

  const getNom = (u) => (typeof u === 'string' ? u : u?.username || '')
  const moi = getNom(currentUser)

  const setShowAjouter = () => {
    setshowAjouterDansGroupe(!showAjouterDansGroupe)
  }

  // Charger les membres quand le groupe change
  useEffect(() => {
    if (!currentGroupe?.id) return

    loadGroupMembers(currentGroupe.id)
      .then((data) => setMembers(data))
      .catch((err) => {
        console.error('Erreur chargement membres:', err)
        setMembers([])
      })
  }, [currentGroupe?.id, loadGroupMembers])

  const handleToggleTheme = async () => {
    try {
      await toggleTheme()
    } catch (err) {
      console.error('Erreur changement thème:', err)
    }
  }

  return (
    <>
      {currentGroupe ? (
        <>
          <div>
            Bienvenue dans le groupe {currentGroupe.type || 'public'}{' '}
            {currentGroupe.nom}
          </div>
          <div>
            Les membres du groupe sont :
            <ul>
              {members.map((p) => {
                const nom = p.username || p.nom || ''
                return <li key={p.id}>{nom}</li>
              })}
            </ul>
          </div>
          <div onClick={handleToggleTheme} className="color-mode-switch">
            {currentUser?.theme === 'light' ? (
              <i className="fa-solid fa-moon"></i>
            ) : (
              <i className="fa-solid fa-sun icon-light"></i>
            )}
          </div>
        </>
      ) : (
        <div>Aucun groupe sélectionné</div>
      )}

      <div>Vous êtes {moi}</div>

      {showAjouterDansGroupe ? (
        <AjouterDansGroupe
          utilisateurs={utilisateurs}
          onClose={onClose}
          currentUser={currentUser}
          currentGroupe={currentGroupe}
          setShowForm={setShowAjouter}
          setCurrentGroupe={setCurrentGroupe}
          setGroupes={setGroupes}
        />
      ) : (
        <AddGroup modifer={false} showFormCreerGroupe={setShowAjouter} />
      )}
    </>
  )
}

export default Topbar
