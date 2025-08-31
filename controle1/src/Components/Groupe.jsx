function Groupe({ groupe, setCurrentGroupe }) {
    return (
        <div className='groupe'>
            <h3 onClick={() => setCurrentGroupe(groupe)}>
                {groupe.nom}
            </h3>
        </div>

    );
}

export default Groupe;
