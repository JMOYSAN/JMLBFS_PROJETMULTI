import Groupe from './Groupe.jsx'

function Topbar({ currentGroupe }) {
  console.log(currentGroupe)
  return (
    <>
      {currentGroupe ? (
        <div>Bienvenue dans le groupe {currentGroupe.nom} </div>
      ) : (
        <div>Aucun groupe sélectionné.</div>
      )}
    </>
  )
}

export default Topbar
