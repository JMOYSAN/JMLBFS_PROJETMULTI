import FormCreerGroupe from '../Form/FormCreerGroupe.jsx'
import Groupe from './Groupe.jsx'
import Logout from "./Logout.jsx";
import AddGroup from "./AddGroup.jsx";

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
  /**
  const groupesFiltrer = groupes.filter((g) => {
    g.participants.includes(currentUser)
  })**/
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
            <AddGroup showFormCreerGroupe={showFormCreerGroupe} />
            <Logout onLogout={onLogout} />
          </div>
          <div>
            {groupes.map((g) => (
              <Groupe groupe={g} setCurrentGroupe={setCurrentGroupe} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
