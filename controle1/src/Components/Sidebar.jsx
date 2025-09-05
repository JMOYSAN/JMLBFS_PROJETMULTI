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
  const groupesFiltrer = groupes.filter((g) =>
      g.participants.some(p => p.nom === currentUser)
  );

  const groupesSansUser = groupes.filter((g) =>
      !g.participants.some(p => p.nom === currentUser)
  );


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
            <AddGroup showFormCreerGroupe={showFormCreerGroupe} />
            <Logout onLogout={onLogout} />
          </div>
          <div>
            Vos Groupes
            {groupesFiltrer.map((g) => (
              <Groupe groupe={g} setCurrentGroupe={setCurrentGroupe} />
            ))}
          </div>
          <div>
            Groupes disponibles
            {groupesSansUser.map((g) => (
              <Groupe groupe={g} setCurrentGroupe={setCurrentGroupe} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
