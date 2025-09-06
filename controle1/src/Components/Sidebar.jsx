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

  const groupesSansUser = groupes.filter(
    (g) =>
      !g.participants.some((p) => p.nom === currentUser) &&
      g.groupeVisibility === 'public'
  )

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

          <div className="sidebar-groups">
            <div className="group-section">
              <h3>Vos Groupes</h3>
              {groupesFiltrer.map((g) => (
                <Groupe
                  key={g.id}
                  groupe={g}
                  setCurrentGroupe={setCurrentGroupe}
                />
              ))}
            </div>

            <div className="group-section">
              <h3>Groupes disponibles</h3>
              {groupesSansUser.map((g) => (
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
