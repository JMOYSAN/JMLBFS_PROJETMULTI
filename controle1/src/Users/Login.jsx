
function Login({ onLogin }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO logic authentification
        onLogin();
    }


    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Nom d'utilisateur" required />
            <button type="submit">Connection</button>
        </form>
    );
}

export default Login;
