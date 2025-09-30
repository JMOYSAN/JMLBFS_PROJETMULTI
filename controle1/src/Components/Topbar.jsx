import AjouterDansGroupe from '../Groupes/AjouterDansGroupe.jsx'
import AddGroup from '../Groupes/AddGroup.jsx'
import { useEffect, useState } from 'react'
import { getGroupUsers } from '../API/getUsersDansGroupe.jsx'

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        theme: currentUser.theme === 'dark' ? 'light' : 'dark',
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors de la mise à jour')
        return res.json()
      })
      .then((data) => {
        setCurrentUser(data)
        localStorage.setItem('user', JSON.stringify(data))
      })
      .catch((err) => {
        console.error('Erreur :', err)
        alert('La mise à jour a échoué')
      })
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
            <MembersList currentGroupe={currentGroupe} />
          </div>
          <div onClick={modifierTheme} className="color-mode-switch">
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
        />
      ) : (
        <AddGroup modifer={false} showFormCreerGroupe={setShowAjouter} />
      )}
    </>
  )
}

function MembersList({ currentGroupe }) {
  const [members, setMembers] = useState([])

  useEffect(() => {
    if (currentGroupe?.id) {
      getGroupUsers(currentGroupe.id).then(setMembers)
    }
  }, [currentGroupe])

  return (
    <ul>
      {members.map((m) => (
        <li key={m.id}>{m.username}</li>
      ))}
    </ul>
  )
}

export default Topbar
