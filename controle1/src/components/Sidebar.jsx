import FormCreerGroupe from '../Form/FormCreerGroupe.jsx'
import Logout from './Logout.jsx'
import AddGroup from '../Groupes/AddGroup.jsx'
import GroupesSidebar from './groupsContent.jsx'
import { useGroups } from '../hooks/useGroups'

function Sidebar({
  onLogout,
  showFormCreerGroupe,
  showForm,
  utilisateurs,
  setShowForm,
  onClose,
  currentUser,
  setCurrentGroupe,
}) {
  // Hook groupes pour le lazy loading
  const { groupes, loadMoreGroups } = useGroups(currentUser)

  return (
    <div id="sidebar">
      {showForm ? (
        <FormCreerGroupe
          utilisateurs={utilisateurs}
          onClose={onClose}
          currentUser={currentUser}
          setShowForm={setShowForm}
        />
      ) : (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <AddGroup showFormCreerGroupe={showFormCreerGroupe} />
            <Logout onLogout={onLogout} />
          </div>

          <GroupesSidebar
            groupes={groupes}
            loadMoreGroups={loadMoreGroups}
            currentUser={currentUser}
            setCurrentGroupe={setCurrentGroupe}
          />
        </div>
      )}
    </div>
  )
}

export default Sidebar
