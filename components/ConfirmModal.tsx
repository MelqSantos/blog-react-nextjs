import React from 'react'

//Definição da interface de propriedades (Props)
interface ConfirmModalProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void | Promise<void> // Aceita funções síncronas ou assíncronas
  title: string
  message: string
  confirmText: string
}

//Uso da interface e desestruturação de todas as props
export default function ConfirmModal({ 
  open, 
  onCancel, 
  onConfirm, 
  title, 
  message, 
  confirmText 
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-sm shadow-lg">
        
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">{message}</p>
        
        <div className="flex justify-center space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-600 text-gray-900 dark:text-gray-100 hover:cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-primary-500 hover:bg-primary-700 text-white font-bold hover:cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}