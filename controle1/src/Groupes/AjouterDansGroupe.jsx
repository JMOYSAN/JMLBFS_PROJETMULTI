import { useMemo, useState } from 'react'

function FormAjouter({
  utilisateurs = [],
  currentGroupe,
  currentUser,
  onClose,
}) {
  const getNom = (u) => (typeof u === 'string' ? u : u?.nom || '')
  const moi = getNom(currentUser)
  const membresActuels = useMemo(
    () => (currentGroupe?.participants ?? []).map(getNom).filter(Boolean),
    [currentGroupe]
  )

  const listeNoms = useMemo(
    () => utilisateurs.map(getNom).filter(Boolean),
    [utilisateurs]
  )

  const [saisie, setSaisie] = useState('')
  const [participantsAjoutes, setParticipantsAjoutes] = useState([])
  const [suggestions, setSuggestions] = useState([])

  const handleAddParticipant = (nom) => {
    const cible = (nom || '').trim()
    if (!cible) return
    const lower = cible.toLowerCase()
    if (lower === moi.toLowerCase()) return
    if (membresActuels.some((n) => n.toLowerCase() === lower)) return
    if (participantsAjoutes.some((n) => n.toLowerCase() === lower)) return
    setParticipantsAjoutes((prev) => [...prev, cible])
    setSaisie('')
    setSuggestions([])
  }

  const mettreAJourSuggestions = (val) => {
    const q = (val || '').toLowerCase()
    if (!q) return setSuggestions([])
    const exclu = new Set([
      ...membresActuels.map((n) => n.toLowerCase()),
      ...participantsAjoutes.map((n) => n.toLowerCase()),
      moi.toLowerCase(),
    ])
    console.log('listenom', listeNoms)
    const res = listeNoms
      .filter((n) => n.toLowerCase().includes(q))
      .filter((n) => !exclu.has(n.toLowerCase()))
      .slice(0, 5)
    console.log('res', res)
    setSuggestions(res)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!currentGroupe) return

    const setSeen = new Set()
    const norm = (nom) => ({ nom, isTyping: false })

    const exists = (arr, nom) =>
      arr.some((p) => getNom(p).toLowerCase() === nom.toLowerCase())

    const fusion = [
      ...(currentGroupe.participants || []),
      ...participantsAjoutes
        .filter((nom) => !exists(currentGroupe.participants || [], nom))
        .map(norm),
    ]
      .filter((p) => {
        const n = getNom(p)
        if (!n) return false
        const k = n.toLowerCase()
        if (setSeen.has(k)) return false
        setSeen.add(k)
        return true
      })
      .map((p) =>
        typeof p === 'string' ? norm(p) : { nom: p.nom, isTyping: !!p.isTyping }
      )

    const groupeMisAJour = { ...currentGroupe, participants: fusion }

    onClose?.(groupeMisAJour)
  }
  console.log('sugesstiom:', suggestions)

  return (
    <div className="form-popup">
      <form onSubmit={handleSubmit}>
        <h2>Ajouter des participants à “{currentGroupe?.nom}”</h2>

        <div>
          Membres actuels :
          <ul>
            {membresActuels.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>

        <label>
          Ajouter un participant :
          <input
            type="text"
            value={saisie}
            onChange={(e) => {
              const v = e.target.value
              setSaisie(v)
              mettreAJourSuggestions(v)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddParticipant(saisie)
              }
            }}
            placeholder="Nom d'utilisateur"
          />
        </label>

        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((nom) => (
              <li key={nom} onClick={() => handleAddParticipant(nom)}>
                {nom}
              </li>
            ))}
          </ul>
        )}

        {participantsAjoutes.length > 0 && (
          <div>
            <strong>À ajouter :</strong>
            <ul className="participants-list">
              {participantsAjoutes.map((nom) => (
                <li key={nom}>{nom}</li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  )
}

export default FormAjouter
