import { useState } from 'react'
import styled from 'styled-components'

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #2c3639, #3f4e4f);
  font-family: 'Arial', sans-serif;
`

const LoginCard = styled.div`
  background: #dcd7c9;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 350px;
  text-align: center;
`

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 28px;
  color: #2c3639;
`

const Input = styled.input`
  width: 90%;
  padding: 12px 15px;
  margin-bottom: 20px;
  border: 1px solid #a27b5c;
  border-radius: 10px;
  font-size: 16px;
  background: #fff;
  outline: none;
  transition: 0.3s;
  &:focus {
    border-color: #3f4e4f;
    box-shadow: 0 0 5px rgba(63, 78, 79, 0.5);
  }
`

const Button = styled.button`
  width: 100%;
  padding: 12px 15px;
  background: #3f4e4f;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #2c3639;
  }
`

function Login({ onLogin, setPage }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) return

    console.log('DATHLIAMUS', username)
    console.log('password', password)
    fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }), //username, password }),
    })
      .then((res) =>
        res.json().then((data) => ({ status: res.status, body: data }))
      )
      .then(({ status, body }) => {
        if (status !== 200) {
          setError(body.error || 'Erreur inconnue')
        } else {
          onLogin(body)
        }
      })
      .catch((err) => {
        console.error(err)
        setError('Erreur serveur')
      })
  }

  return (
    <LoginWrapper>
      <LoginCard>
        <Title>Connexion</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button type="submit">Se connecter</Button>
        </form>
        <p style={{ textAlign: 'center', color: 'black' }}>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setPage('register')}
          >
            Pas encore de compte ? Créer un compte
          </button>
        </p>
      </LoginCard>
    </LoginWrapper>
  )
}

export default Login
