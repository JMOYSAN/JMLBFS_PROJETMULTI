function Topbar({ currentGroupe, currentUser }) {
  return (
    <>
      {currentGroupe ? (
        <>
          {currentGroupe.participants ? (
            <>
              <div>
                Bienvenue dans le groupe {currentGroupe.groupeVisibility}{' '}
                {currentGroupe.nom}
              </div>
              <div>
                Les membres du groupe sont :
                <ul>
                  {currentGroupe.participants.map((participant, index) => (
                    <li key={index}>{participant.nom}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div>Aucun groupe sélectionné.</div>
          )}
        </>
      ) : (
        <div>Aucun groupe sélectionné</div>
      )}
      <div>Vous êtes {currentUser}</div>
    </>
  )
}

export default Topbar
