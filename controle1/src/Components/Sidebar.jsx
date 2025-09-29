import FormCreerGroupe from '../Form/FormCreerGroupe.jsx'

import Logout from './Logout.jsx'
import AddGroup from '../Groupes/AddGroup.jsx'
import GroupesSidebar from './groupsContent.jsx'

function Sidebar({
  onLogout,
  showFormCreerGroupe,
  showForm,
  utilisateurs,
  onClose,
  groupes,
  setGroups,
  currentUser,
}) {
  console.log('PGrggrrgr:', groupes)
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

          <GroupesSidebar groupes={groupes} setGroupes={setGroups} />
        </div>
      )}
    </div>
  )
}

export default Sidebar
