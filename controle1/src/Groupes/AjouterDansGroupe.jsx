import { useState, useEffect } from 'react'
import { useGroups } from '../hooks/useGroups'

function AjouterDansGroupe({
  utilisateurs = [],
  currentGroupe,
  currentUser,
  setShowForm,
}) {
  const [saisie, setSaisie] = useState('')
  const [members, setMembers] = useState([])

  const { addMemberToGroupe, loadGroupMembers, pending } =
    useGroups(currentUser)
  //commentaire
  const getNom = (u) =>
    typeof u === 'string' ? u : u?.nom || u?.username || ''

  // Charger les membres actuels
  useEffect(() => {
    if (!currentGroupe?.id) return

    loadGroupMembers(currentGroupe.id)
      .then((data) => setMembers(data))
      .catch((err) => console.error('Erreur chargement membres:', err))
  }, [currentGroupe?.id, loadGroupMembers])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentGroupe?.id || !saisie.trim()) return

    try {
      const user = utilisateurs.find(
        (u) => getNom(u).toLowerCase() === saisie.trim().toLowerCase()
      )

      if (!user) {
        //alert('Utilisateur introuvable')
        return
      }

      await addMemberToGroupe(user.id, currentGroupe.id)

      // Recharger les membres
      const updatedMembers = await loadGroupMembers(currentGroupe.id)
      setMembers(updatedMembers)

      //alert('Participant ajouté avec succès')
      setSaisie('')
      setShowForm?.(false)
    } catch (err) {
      console.error('Erreur handleSubmit:', err)
      alert(err.message || "Erreur lors de l'ajout")
    }
  }

  return (
    <div className="form-popup">
      <form onSubmit={handleSubmit}>
        <h2>Ajouter un participant à "{currentGroupe?.nom}"</h2>

        <div>
          Membres actuels :
          <ul>
            {members.map((p) => (
              <li key={p.id}>{getNom(p)}</li>
            ))}
          </ul>
        </div>

        <label>
          Nom d'utilisateur :
          <input
            type="text"
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            placeholder="Nom d'utilisateur"
            disabled={pending}
          />
        </label>

        <button type="submit" disabled={pending}>
          {pending ? 'Ajout...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  )
}

export default AjouterDansGroupe
