function Topbar({ currentGroupe, currentUser }) {
  console.log('currentGroupe')
  console.log(currentGroupe)

  return (
    <>
      {currentGroupe.participants ? (
        <>
          <div>Bienvenue dans le groupe {currentGroupe.nom}</div>
          <div>
            Les membres du groupe sont :
            <ul>
              {currentGroupe.participants.map((participant) => (
                <li>{participant}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div>Aucun groupe sélectionné.</div>
      )}

      <div>Vous êtes {currentUser}</div>
    </>
  )
}

export default Topbar
