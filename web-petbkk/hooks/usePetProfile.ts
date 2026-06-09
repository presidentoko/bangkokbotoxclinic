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
  }, [])

  const saveProfile = useCallback((p: PetProfile) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(p))
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
