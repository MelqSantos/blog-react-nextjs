'use client'

import { useState, useEffect } from 'react'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { PencilIcon, TrashIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import EditPostModal from '@/components/Modal'
import { toast, Toaster } from 'react-hot-toast'
import ConfirmModal from '@/components/ConfirmModal'
import Tag from '@/components/Tag'
import { postEndpoints } from 'app/api/urls'

interface Post {
  id: string
  title: string
  content: string
  subject: string
  createdat: string
  updatedat: string
  author_id: number
}

interface PaginationProps {
  totalPages: number
  currentPage: number
}

function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps & { onPageChange: (page: number) => void }) {
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between items-center">
        <button
          className="cursor-pointer px-3 py-2 rounded text-primary-500 hover:text-primary-100 bg-transparent hover:bg-primary-600 disabled:opacity-50 flex items-center mr-2"
          disabled={!prevPage}
          onClick={() => prevPage && onPageChange(currentPage - 1)}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <span>
          {currentPage} of {totalPages}
        </span>
        <button
          className="cursor-pointer px-3 py-2 rounded text-primary-500 hover:text-primary-100 bg-transparent hover:bg-primary-600 disabled:opacity-50 flex items-center ml-2"
          disabled={!nextPage}
          onClick={() => nextPage && onPageChange(currentPage + 1)}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </nav>
    </div>
  )
}

export default function ListLayout({ title }: { title: string }) {
  const [searchValue, setSearchValue] = useState('')
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  
  const POSTS_PER_PAGE = 5

  // VARIÁVEL DE CONVENIÊNCIA: Indica se o usuário é professor
  const isProfessor = userRole === 'PROFESSOR'

  useEffect(() => {
    const role = localStorage.getItem('role')
    setUserRole(role)
    refreshPosts()
  }, [searchValue])


  const handleRemove = (id: string) => {
    if (isProfessor) {
        setConfirmId(id)
    } else {
        toast.error('Você não tem permissão para remover posts.')
    }
  }

  const handleEdit = (post: Post) => {
    if (isProfessor) {
        setSelectedPost(post)
        setShowModal(true)
    } else {
        toast.error('Você não tem permissão para editar posts.')
    }
  }

  const handleAdd = () => {
    if (isProfessor) { // Condição para adicionar
        setSelectedPost({
          id: '',
          title: '',
          content: '',
          subject: '',
          createdat: '',
          updatedat: '',
          author_id: 1,
        })
        setShowModal(true)
    } else {
        toast.error('Você não tem permissão para adicionar posts.')
    }
  }

  const handleSave = (isNew: boolean) => {
    toast.success(isNew ? 'Post criado com sucesso!' : 'Post editado com sucesso!')
    refreshPosts()
  }

  const refreshPosts = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      let url = ''
      if (searchValue) {
        url = `${postEndpoints.search}/${encodeURIComponent(searchValue)}`
      } else {
        url = postEndpoints.list
      }
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      const postsArray = Array.isArray(data) ? data : Array.isArray(data.posts) ? data.posts : []
      setAllPosts(postsArray)
      setCurrentPage(1)
    } catch (err) {
      setAllPosts([])
    }
    setLoading(false)
  }

  // Paginação no front-end
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE))
  const paginatedPosts = allPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  return (
    <>
      <Toaster position="top-right" />
      {showModal && selectedPost && (
        <EditPostModal
          post={selectedPost}
          onClose={() => setShowModal(false)}
          onSave={() => handleSave(!selectedPost?.id)}
        />
      )}

      <ConfirmModal
        open={!!confirmId}
        onCancel={() => setConfirmId(null)}
        onConfirm={async () => {
          const token = localStorage.getItem('token')
          const res = await fetch(`${postEndpoints.delete}/${confirmId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
          if (res.ok) {
            toast.success('Post excluído com sucesso!')
            refreshPosts()
          } else {
            toast.error('Erro ao excluir o post.')
          }
          setConfirmId(null)
        }}
        title="Confirmar Exclusão"
        message="Tem certeza de que deseja excluir este post permanentemente?"
        confirmText="Excluir"
      />

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
          <div className="flex items-center justify-between mt-4">
            <div className="relative max-w-lg flex items-center w-full">
              <label className="w-full">
                <span className="sr-only">Buscar</span>
                <input
                  aria-label="Search articles"
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value)
                  }}
                  placeholder="Search articles"
                  className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
                />
              </label>
              <svg
                className="absolute top-3 right-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            {isProfessor && (
              <button
                title="Adicionar publicação"
                onClick={handleAdd}
                className="ml-4 p-2 cursor-pointer px-3 py-2 rounded text-primary-500 hover:text-primary-100 bg-transparent hover:bg-primary-600 disabled:opacity-50 flex items-center ml-2"
                style={{ alignSelf: 'stretch', height: '42px' }}
              >
                <PlusIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
        <ul>
          {loading && <li>Carregando...</li>}
          {!loading && !paginatedPosts.length && 'No posts found.'}
          {paginatedPosts.map((post) => (
            <li key={post.id} className="py-4">
              <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                <dl>
                  <dt className="sr-only">Publicado em</dt>
                  <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                    <time dateTime={post.createdat}>
                      {new Date(post.createdat).toLocaleString()}
                    </time>
                  </dd>
                </dl>
                <div className="space-y-3 xl:col-span-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl leading-8 font-bold tracking-tight">
                        <Link href={`/post/${post.id}`} className="text-gray-900 dark:text-gray-100">
                          {post.title}
                        </Link>
                      </h3>
                      <div className="flex flex-wrap">
                        <Tag text={post.subject} />
                      </div>
                    </div>
                    {isProfessor && (
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          title="Editar"
                          onClick={() => handleEdit(post)}
                          className="p-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900 hover:cursor-pointer"
                        >
                          <PencilIcon className="h-5 w-5 text-primary-500" />
                        </button>
                        <button
                          title="Remover"
                          onClick={() => handleRemove(post.id)}
                          className="p-2 rounded hover:bg-white-100 dark:hover:bg-red-900 hover:cursor-pointer"
                        >
                          <TrashIcon className="h-5 w-5 text-white-500" /> 
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                    {post.content}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
      {totalPages > 1 && (
        <div className="flex flex-col items-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <div className="w-full flex justify-center py-2 text-sm text-gray-500 dark:text-gray-400">
            Total de registros: {allPosts.length}
          </div>
        </div>
      )}
      {totalPages <= 1 && (
        <div className="w-full flex justify-center py-4 text-sm text-gray-500 dark:text-gray-400">
          Total de registros: {allPosts.length}
        </div>
      )}
    </>
  )
}