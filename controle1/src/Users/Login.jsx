import {useState} from "react";

function Login({ onLogin }) {

    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim() === "") return;
        onLogin(username);
    };


    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <button type="submit">Connection</button>
        </form>
    );
}

export default Login;
