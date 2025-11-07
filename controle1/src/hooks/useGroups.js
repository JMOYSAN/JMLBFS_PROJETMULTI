// src/hooks/useGroups.js
import { useCallback, useEffect, useState } from 'react'
import {
  listPublicGroups,
  listPrivateGroups,
  fetchNextGroups,
  createGroup,
  addUserToGroup,
  getGroupMembers,
} from '../services/groupService.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function useGroups() {
  const { currentUser } = useAuth()

  const [publicGroups, setPublicGroups] = useState([])
  const [privateGroups, setPrivateGroups] = useState([])
  const [membersByGroup, setMembersByGroup] = useState({})
  const [offset, setOffset] = useState(0)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const loadPublic = useCallback(async () => {
    setPending(true)
    setError('')
    try {
      const list = await listPublicGroups()
      setPublicGroups(list)
    } catch (e) {
      setError(e.message || 'Erreur groupes publics')
      setPublicGroups([])
    } finally {
      setPending(false)
    }
  }, [])

  const loadPrivate = useCallback(async () => {
    if (!currentUser?.id) return
    setPending(true)
    setError('')
    try {
      const list = await listPrivateGroups(currentUser.id)
      setPrivateGroups(list)
    } catch (e) {
      setError(e.message || 'Erreur groupes privés')
      setPrivateGroups([])
    } finally {
      setPending(false)
    }
  }, [currentUser?.id])

  const loadMore = useCallback(async () => {
    setPending(true)
    setError('')
    try {
      const page = await fetchNextGroups(offset)
      setPublicGroups((prev) => [...prev, ...page])
      setOffset((prev) => prev + page.length)
    } catch (e) {
      setError(e.message || 'Erreur pagination groupes')
    } finally {
      setPending(false)
    }
  }, [offset])

  const loadMembers = useCallback(async (groupId) => {
    setError('')
    try {
      const members = await getGroupMembers(groupId)
      setMembersByGroup((prev) => ({ ...prev, [groupId]: members }))
    } catch (e) {
      setError(e.message || 'Erreur chargement membres')
    }
  }, [])

  const create = useCallback(async (name, isPrivate = false) => {
    const g = await createGroup(name, isPrivate)
    if (isPrivate) setPrivateGroups((prev) => [g, ...prev])
    else setPublicGroups((prev) => [g, ...prev])
    return g
  }, [])

  const addUser = useCallback(
    async (groupId, userId) => {
      await addUserToGroup(groupId, userId)
      // optionally refresh members
      await loadMembers(groupId)
    },
    [loadMembers]
  )

  useEffect(() => {
    loadPublic()
  }, [loadPublic])
  useEffect(() => {
    loadPrivate()
  }, [loadPrivate])

  return {
    publicGroups,
    privateGroups,
    membersByGroup,
    pending,
    error,
    loadMore,
    loadMembers,
    createGroup: create,
    addUserToGroup: addUser,
  }
}
