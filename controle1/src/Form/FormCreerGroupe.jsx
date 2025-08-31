import { useState, useEffect } from "react";

function FormCreerGroupe({ utilisateurs, onClose }) {
    const [nomGroupe, setNomGroupe] = useState("");
    const [participant, setParticipant] = useState("");
    const [participantsAjoutes, setParticipantsAjoutes] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    console.log("Participant:", participant);
    console.log("Suggestions:", suggestions);
    console.log("ParticipantAjoutee:", participantsAjoutes);
    console.log('utilisateur:', utilisateurs)

    const handleAddParticipant = (name) => {
        if (name && !participantsAjoutes.includes(name) && utilisateurs.some(u => u === name)) {
            setParticipantsAjoutes([...participantsAjoutes, name]);
            setParticipant("");
            setSuggestions([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Nom du groupe:", nomGroupe);
        console.log("Participants:", participantsAjoutes);

        if (onClose) onClose(nomGroupe,participantsAjoutes);
    };

    return (
        <div className="form-popup">
            <form onSubmit={handleSubmit}>
                <h2>Créer un nouveau groupe</h2>
                <label>
                    Nom du groupe:
                    <input
                        type="text"
                        value={nomGroupe}
                        onChange={(e) => setNomGroupe(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Ajouter un participant:
                    <input
                        type="text"
                        value={participant}
                        onChange={(e) => {
                            setParticipant(e.target.value)
                            setSuggestions(utilisateurs.filter(
                                (u) =>
                                    u.toLowerCase().includes(e.target.value.toLowerCase()) &&
                                    !participantsAjoutes.includes(u)
                            ).slice(0, 5))
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddParticipant(participant);
                            }
                        }}
                    />
                </label>
                {suggestions.length > 0 && (
                    <div>
                        <h3>Suggestions</h3>
                        <ul className="suggestions">
                            {suggestions.map((u) => (
                                <li key={u} onClick={() => handleAddParticipant(u)}>
                                    {u}
                                </li>
                            ))}
                        </ul>
                    </div>

                )}

                {participantsAjoutes.length > 0 && (
                    <div>
                        <strong>Participants ajoutés :</strong>
                        <ul>
                            {participantsAjoutes.map((p) => (
                                <li key={p}>{p}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <button type="submit">Créer le groupe</button>
            </form>
        </div>
    );
}

export default FormCreerGroupe;
