import { useState } from 'react'

export default function EditPostModal({ post, onClose, onSave }) {
  const isNew = !post.id
  const [form, setForm] = useState({
    title: post.title || '',
    content: post.content || '',
    subject: post.subject || '',
    author_id: post.author_id || 1,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const url = isNew
        ? 'http://localhost:8080/posts'
        : `http://localhost:8080/posts/${post.id}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(isNew ? 'Erro ao criar postagem' : 'Erro ao editar postagem')
      onSave()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {isNew ? 'Nova Postagem' : 'Editar Postagem'}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Título</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Conteúdo</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Assunto</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          {/* author_id é enviado, mas não editável */}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-600 text-gray-900 dark:text-gray-100 hover:cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-400 text-white font-bold hover:cursor-pointer disabled:opacity-50"
            >
              {loading ? (isNew ? 'Criando...' : 'Salvando...') : (isNew ? 'Criar' : 'Salvar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}