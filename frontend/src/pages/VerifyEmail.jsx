import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

export default function VerifyEmail() {
  const { key } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function verify() {
      try {
        await api.post('/api/verify-email/', { key })
        setStatus('success')
        setMessage('Email verified. Redirecting to login...')
        setTimeout(() => navigate('/login'), 1500)
      } catch (err) {
        setStatus('error')
        const detail = err?.response?.data?.detail || 'Verification failed.'
        setMessage(detail)
      }
    }
    if (key) verify()
  }, [key, navigate])

  if (status === 'verifying') return <div>Verifying email...</div>
  if (status === 'success') return <div>{message}</div>
  return <div>{message || 'Invalid or expired link.'}</div>
}


