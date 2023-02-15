import { deleteCookie, getCookie } from 'cookies-next';
import { User } from '@prisma/client'
import { useEffect, useState } from 'react';

export const api = async () => {
  try {
    const res = await fetch('/api/auth/session')
    const data = (await res.json()).user
    return data
  } catch (e) {
    throw e
  }
}

export const useUserInfo = () => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    (
      async () => {
        try {
          const id = getCookie("mi-auth.id")?.toString()
          const tk = getCookie("mi-auth.token")?.toString()
          const data = await api()
          if (!tk || !data || !id) throw new Error("Not Found")
          setToken(tk)
          setUser(data)
        } catch (e: any) {
          setError(e)
          deleteCookie("mi-auth.id")
          deleteCookie("mi-auth.token")
          deleteCookie("mi-auth.origin")
        } finally {
          setLoading(false)
        }
      }
    )()
  }, [])

  return { user, token, error, loading }
}