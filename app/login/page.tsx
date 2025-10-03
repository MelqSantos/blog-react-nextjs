'use client'
import { useState } from 'react'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import userEndpoints from '@/data/urls'

const initialForm = { username: '', password: '', role: 'PROFESSOR' }

export default function Login() {
  const [form, setForm] = useState(initialForm)
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const url = isRegister
        ? userEndpoints.create
        : userEndpoints.login
      const body = isRegister
        ? { username: form.username, password: form.password, role: form.role }
        : { username: form.username, password: form.password }
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Usuário ou senha inválidos')
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      alert(isRegister ? 'Cadastro realizado!' : 'Login realizado!')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded-lg shadow-lg bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
        {isRegister ? 'Cadastro' : 'Login'}
      </h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
        {isRegister
          ? 'Crie sua conta para acessar o Blog Academy.'
          : siteMetadata.description}
      </p>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {isRegister && (
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Tipo de usuário</label>
            <select
              name="role"
              required
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="PROFESSOR">PROFESSOR</option>
              <option value="ALUNO">ALUNO</option>
            </select>
          </div>
        )}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Usuário</label>
          <input
            type="text"
            name="username"
            required
            value={form.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Senha</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 dark:hover:bg-primary-400 text-white font-bold rounded"
        >
          {loading ? 'Enviando...' : isRegister ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <button
          type="button"
          className="text-primary-500 hover:underline"
          onClick={() => {
            setIsRegister(!isRegister)
            console.log(isRegister)
            setError('')
          }}
        >
          {isRegister
            ? 'Já tem uma conta? Faça login'
            : 'Não tem conta? Cadastre-se'}
        </button>
      </div>
    </div>
  )
}