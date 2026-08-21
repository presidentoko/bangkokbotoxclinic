'use client'
import { useState, useEffect, useCallback } from 'react'
import type { PetProfile } from '@/lib/types'

const KEY = 'petProfile'

export function usePetProfile() {
  const [profile, setProfileState] = useState<PetProfile | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setProfileState(JSON.parse(raw) as PetProfile)
    } catch {
      // ignore parse errors
    }
    setReady(true)

    // /my-pet writes the same key through the bridge; reflect it live.
    const read = () => {
      try {
        const next = localStorage.getItem(KEY)
        setProfileState(next ? (JSON.parse(next) as PetProfile) : null)
      } catch {}
    }
    window.addEventListener('petProfileUpdate', read)
    return () => window.removeEventListener('petProfileUpdate', read)
  }, [])

  const saveProfile = useCallback((p: PetProfile) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(p))
      window.dispatchEvent(new Event('petProfileUpdate'))
    } catch {}
    setProfileState(p)
  }, [])

  const clearProfile = useCallback(() => {
    try {
      localStorage.removeItem(KEY)
    } catch {}
    setProfileState(null)
  }, [])

  return { profile, ready, saveProfile, clearProfile }
}
