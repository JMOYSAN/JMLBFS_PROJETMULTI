import { useState } from 'react'
import styled from 'styled-components'

const RegisterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #2c3639, #3f4e4f);
  font-family: 'Arial', sans-serif;
`

const RegisterCard = styled.div`
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

function Register({ onRegister, setPage }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!username.trim() || !password.trim()) return
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    fetch('http://localhost:3000/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((res) =>
        res.json().then((data) => ({ status: res.status, body: data }))
      )
      .then(({ status, body }) => {
        if (status !== 201) {
          setError(body.error || 'Erreur lors de l’inscription')
        } else {
          setSuccess('Compte créé avec succès !')
          if (onRegister) onRegister(body)
        }
      })
      .catch((err) => {
        console.error(err)
        setError(`Erreur serveur`)
      })
  }

  return (
    <RegisterWrapper>
      <RegisterCard>
        <Title>Inscription</Title>
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
          <Input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <Button type="submit">S'inscrire</Button>
        </form>
        <p style={{ textAlign: 'center', color: 'black' }}>
          <button
            onClick={() => setPage('login')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Déjà inscrit ? Se connecter
          </button>
        </p>
      </RegisterCard>
    </RegisterWrapper>
  )
}

export default Register
