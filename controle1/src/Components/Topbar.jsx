import AjouterDansGroupe from '../Groupes/AjouterDansGroupe.jsx'
import AddGroup from '../Groupes/AddGroup.jsx'
import { useEffect, useState } from 'react'

function Topbar({
  utilisateurs = [],
  currentGroupe,
  currentUser,
  setCurrentUser,
  onClose,
  setCurrentGroupe,
  setGroupes,
}) {
  const getNom = (u) => (typeof u === 'string' ? u : u?.username || '')
  const moi = getNom(currentUser)

  const setShowAjouter = () => {
    setshowAjouterDansGroupe(!showAjouterDansGroupe)
  }

  const modifierTheme = () => {
    fetch(`http://localhost:3000/users/${currentUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        theme: currentUser.theme === 'dark' ? 'light' : 'dark',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour')
        }
        return response.json()
      })
      .then((data) => {
        console.log('Utilisateur mis à jour :', data)
        setCurrentUser(data)
        localStorage.setItem('user', JSON.stringify(data))
      })
      .catch((error) => {
        console.error('Erreur :', error)
        alert('La mise à jour a échoué')
      })
  }
  const [members, setMembers] = useState([])

  useEffect(() => {
    if (!currentGroupe?.id) return
    fetch(`http://localhost:3000/groups-users/group/${currentGroupe.id}`)
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => {
        console.error('Erreur chargement membres:', err)
        setMembers([])
      })
  }, [currentGroupe])
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
              {members.map((p) => {
                const nom = p.username || p.nom || ''
                return <li key={p.id}>{nom}</li>
              })}
            </ul>
          </div>
          <div onClick={() => modifierTheme()} className="color-mode-switch">
            {currentUser.theme === 'light' ? (
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
        ></AjouterDansGroupe>
      ) : (
        <AddGroup modifer={false} showFormCreerGroupe={setShowAjouter} />
      )}
    </>
  )
}

export default Topbar
