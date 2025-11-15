import { useEffect, useState } from 'react'
import { useGroups } from '../hooks/useGroups'

function Groupe({ currentUser, groupe, setCurrentGroupe }) {
  const [askConfirm, setAskConfirm] = useState(false)
  const [isMember, setIsMember] = useState(false)

  const { joinGroupe, loadGroupMembers, pending } = useGroups(currentUser)

  // Vérifier si l'utilisateur est membre du groupe
  useEffect(() => {
    if (!groupe?.id || !currentUser?.id) return

    loadGroupMembers(groupe.id)
      .then((members) => {
        const found = members.some((m) => m.id === currentUser.id)
        setIsMember(found)
      })
      .catch((err) =>
        console.error('Erreur vérification membre du groupe:', err)
      )
  }, [groupe?.id, currentUser?.id, loadGroupMembers])

  const handleClick = () => {
    if (isMember) {
      setCurrentGroupe(groupe)
      return
    }
    setAskConfirm(true)
  }

  const handleJoin = async () => {
    try {
      await joinGroupe(groupe.id)
      setIsMember(true)
      setAskConfirm(false)
    } catch (err) {
      console.error('Erreur lors de la jointure au groupe:', err)
      //alert('Impossible de rejoindre le groupe')
    }
  }

  return (
    <>
      <div onClick={handleClick} className="groupe">
        <h3>{groupe.nom}</h3>
      </div>

      {askConfirm && (
        <div className="confirm-join">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleJoin()
            }}
            className="confirm-box"
          >
            <p>Voulez-vous rejoindre ce groupe&nbsp;?</p>
            <div className="actions">
              <button type="submit" className="btn-yes" disabled={pending}>
                {pending ? '...' : 'Oui'}
              </button>
              <button
                type="button"
                onClick={() => setAskConfirm(false)}
                className="btn-no"
              >
                Non
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default Groupe
