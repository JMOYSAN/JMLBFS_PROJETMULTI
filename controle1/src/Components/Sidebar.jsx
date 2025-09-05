import FormCreerGroupe from '../Form/FormCreerGroupe.jsx'
import Groupe from './Groupe.jsx'

function Sidebar({
  onLogout,
  showFormCreerGroupe,
  showForm,
  utilisateurs,
  onCLose,
  groupes,
  setCurrentGroupe,
  currentUser,
}) {
  const groupesFiltrer = groupes.filter((g) =>
    g.participants.includes(currentUser)
  )

  console.log(groupes)
  return (
    <div id="sidebar">
      {showForm ? (
        <FormCreerGroupe
          utilisateurs={utilisateurs}
          onClose={onCLose}
          currentUser={currentUser}
        />
      ) : (
        <div>
          <div>
            <button id="deconnexion" onClick={onLogout}>
              Déconnexion
            </button>
            <button id="creerGroupe" onClick={showFormCreerGroupe}>
              Créer un nouveau groupe
            </button>
          </div>
          <div>
            {groupesFiltrer.map((g) => (
              <Groupe groupe={g} setCurrentGroupe={setCurrentGroupe} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
