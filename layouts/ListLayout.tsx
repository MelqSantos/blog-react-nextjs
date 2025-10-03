'use client'

import { useState, useEffect } from 'react'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

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
      <nav className="flex justify-between">
        <button
          className="cursor-pointer px-4 py-2 rounded bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50"
          disabled={!prevPage}
          onClick={() => prevPage && onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          {currentPage} of {totalPages}
        </span>
        <button
          className="cursor-pointer px-4 py-2 rounded bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50"
          disabled={!nextPage}
          onClick={() => nextPage && onPageChange(currentPage + 1)}
        >
          Next
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
  const POSTS_PER_PAGE = 5

  // Função para remover post
  const handleRemove = async (id: string) => {
    const token = localStorage.getItem('token')
    await fetch(`http://localhost:8080/posts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // Refresh dos posts após remover
    refreshPosts()
  }

  // Função para editar post (exemplo: redireciona para página de edição)
  const handleEdit = (id: string) => {
    window.location.href = `/post/edit/${id}`
  }

  // Função para buscar posts (usada no useEffect e após editar/remover)
  const refreshPosts = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      let url = ''
      if (searchValue) {
        url = `http://localhost:8080/posts/search/${encodeURIComponent(searchValue)}`
      } else {
        url = `http://localhost:8080/posts`
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

  useEffect(() => {
    refreshPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  // Paginação no front-end
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE))
  const paginatedPosts = allPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
          <div className="relative max-w-lg">
            <label>
              <span className="sr-only">Search articles</span>
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
        </div>
        <ul>
          {loading && <li>Carregando...</li>}
          {!loading && !paginatedPosts.length && 'No posts found.'}
          {paginatedPosts.map((post) => (
            <li key={post.id} className="py-4">
              <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                    <time dateTime={post.createdat}>
                      {new Date(post.createdat).toLocaleDateString()}
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
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        title="Editar"
                        onClick={() => handleEdit(post.id)}
                        className="p-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900"
                      >
                        <PencilIcon className="h-5 w-5 text-primary-500" />
                      </button>
                      <button
                        title="Remover"
                        onClick={() => handleRemove(post.id)}
                        className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <TrashIcon className="h-5 w-5 text-acqua-500" />
                      </button>
                    </div>
                  </div>
                  <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                    {post.content.length > 200
                      ? post.content.slice(0, 200) + '...'
                      : post.content}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  )
}
