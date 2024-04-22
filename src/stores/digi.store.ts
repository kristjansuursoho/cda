import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { DigiDocument } from '@/types'

export const useDigiStore = defineStore('digi', () => {
  const token = ref(localStorage.getItem('token')?.trim() ?? null)

  const api = axios.create({
    baseURL: 'https://digi.costpocket.com/api/',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token.value}`

    return config
  })

  function commitToken(_token: string) {
    localStorage.setItem('token', _token)
    token.value = _token
  }

  function removeToken() {
    localStorage.removeItem('token')
    token.value = null
  }

  async function uploadDocument(
    imageFile: File,
    lines = false
  ): Promise<DigiDocument> {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('lines', String(lines))

      const { data: document } = await api.post('/document', formData)

      return document
    } catch (error) {
      console.log('@uploadDocument - ERROR', error)
      throw new Error('CANT_UPLOAD_DOCUMENT')
    }
  }

  async function uploadDocumentWithLines(
    imageFile: File
  ): Promise<DigiDocument> {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const { data: document } = await api.post('/document/lines', formData)

      return document
    } catch (error) {
      console.log('@uploadDocumentWithLines - ERROR', error)
      throw new Error('CANT_UPLOAD_DOCUMENT_WITH_LINES')
    }
  }

  async function uploadMockDocument(
    imageFile: File,
    lines = false
  ): Promise<DigiDocument> {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('lines', String(lines))

      const { data: document } = await api.post('/test/document', formData)

      return document
    } catch (error) {
      console.log('@uploadDocumentWithLines - ERROR', error)
      throw new Error('CANT_UPLOAD_MOCK_DOCUMENT')
    }
  }

  async function uploadMockDocumentWithLines(
    imageFile: File
  ): Promise<DigiDocument> {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const { data: document } = await api.post(
        '/test/document/lines',
        formData
      )

      return document
    } catch (error) {
      console.log('@uploadMockDocumentWithLines - ERROR', error)
      throw new Error('CANT_UPLOAD_MOCK_DOCUMENT_WITH_LINES')
    }
  }

  return {
    api,
    token,
    uploadDocument,
    uploadDocumentWithLines,
    uploadMockDocument,
    uploadMockDocumentWithLines,
    commitToken,
    removeToken,
  }
})
