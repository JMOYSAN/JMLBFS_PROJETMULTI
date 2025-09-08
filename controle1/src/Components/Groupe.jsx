function Groupe({ currentUser, groupe, setCurrentGroupe }) {
  const estMembre = groupe.participants.some(
    (p) => (typeof p === 'string' ? p : p.nom) === currentUser.nom
  )

  const handleClick = () => {
    if (estMembre) {
      setCurrentGroupe(groupe)
    } else {
      const ok = window.confirm(
        `Voulez-vous rejoindre le groupe "${groupe.nom}" ?`
      )
      if (ok) {
        console.log('TEST :' + groupe.participants)
        console.log('USER :' + currentUser)
        groupe.participants.push({
          nom: currentUser,
          typing: false,
        })

        console.log('TEST :', groupe.participants)

        setCurrentGroupe(groupe)
        console.log(groupe.participants)
      }
    }
  }

  return (
    <div onClick={handleClick} className="groupe">
      <h3>{groupe.nom}</h3>
    </div>
  )
}

export default Groupe
