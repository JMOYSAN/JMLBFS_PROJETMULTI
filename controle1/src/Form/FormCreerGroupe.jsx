import { useState } from 'react'
import { useGroups } from '../hooks/useGroups'

function FormCreerGroupe({ utilisateurs, currentUser, setShowForm }) {
  const [nomGroupe, setNomGroupe] = useState('')
  const [participant, setParticipant] = useState('')
  const [participantsAjoutes, setParticipantsAjoutes] = useState([])
  const [groupeVisibility, setGroupeVisibility] = useState('public')

  const { creerGroupe, pending } = useGroups(currentUser)

  const getNom = (u) =>
    typeof u === 'string' ? u : u?.nom || u?.username || ''

  const handleAddParticipant = (nom) => {
    const cible = (nom || '').trim()
    if (!cible) return
    if (
      participantsAjoutes.some((n) => n.toLowerCase() === cible.toLowerCase())
    )
      return
    setParticipantsAjoutes((prev) => [...prev, cible])
    setParticipant('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nomGroupe.trim()) return

    try {
      const isPrivate = groupeVisibility === 'private'
      await creerGroupe(nomGroupe, participantsAjoutes, isPrivate, utilisateurs)
      setShowForm(false)
    } catch (err) {
      console.error('Erreur handleSubmit:', err)
      alert(err.message || 'Erreur lors de la création du groupe')
    }
  }

  return (
    <div className="form-popup">
      <form onSubmit={handleSubmit}>
        <h2>Créer un nouveau groupe</h2>
        <label>
          Nom du groupe :
          <input
            type="text"
            value={nomGroupe}
            onChange={(e) => setNomGroupe(e.target.value)}
            required
            disabled={pending}
          />
        </label>
        <label>
          Choisir la visibilité :
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="public"
                checked={groupeVisibility === 'public'}
                onChange={(e) => setGroupeVisibility(e.target.value)}
                disabled={pending}
              />
              Public
            </label>
            <label>
              <input
                type="radio"
                value="private"
                checked={groupeVisibility === 'private'}
                onChange={(e) => setGroupeVisibility(e.target.value)}
                disabled={pending}
              />
              Privé
            </label>
          </div>
        </label>
        <label>
          Ajouter un participant :
          <input
            type="text"
            value={participant}
            onChange={(e) => setParticipant(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddParticipant(participant)
              }
            }}
            placeholder="Nom d'utilisateur"
            disabled={pending}
          />
        </label>
        {participantsAjoutes.length > 0 && (
          <div>
            <strong>Participants ajoutés :</strong>
            <ul className="participants-list">
              {participantsAjoutes.map((nom) => (
                <li key={nom}>{nom}</li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit" disabled={pending}>
          {pending ? 'Création...' : 'Créer le groupe'}
        </button>
      </form>
    </div>
  )
}

export default FormCreerGroupe
