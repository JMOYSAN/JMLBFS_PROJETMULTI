import AjouterDansGroupe from '../Groupes/AjouterDansGroupe.jsx'
import AddGroup from '../Groupes/AddGroup.jsx'
import { useState } from 'react'

function Topbar({
  utilisateurs = [],
  currentGroupe,
  currentUser,
  onClose,
  setCurrentGroupe,
  setGroupes,
}) {
  const getNom = (u) => (typeof u === 'string' ? u : u?.nom || '')
  const moi = getNom(currentUser)

  const setShowAjouter = () => {
    setshowAjouterDansGroupe(!showAjouterDansGroupe)
  }
  const [showAjouterDansGroupe, setshowAjouterDansGroupe] = useState(false)
  return (
    <>
      {currentGroupe ? (
        <>
          <div>
            Bienvenue dans le groupe {currentGroupe.groupeVisibility}{' '}
            {currentGroupe.nom}
          </div>
          <div>
            Les membres du groupe sont :
            <ul>
              {(currentGroupe.participants ?? []).map((p) => {
                const nom = getNom(p)
                return <li key={nom}>{nom}</li>
              })}
            </ul>
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
        ></AjouterDansGroupe>
      ) : (
        <AddGroup modifer={false} showFormCreerGroupe={setShowAjouter} />
      )}
    </>
  )
}

export default Topbar
