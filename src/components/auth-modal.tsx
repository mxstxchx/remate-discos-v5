'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useAuth } from '@/app/providers'
import GB from 'country-flag-icons/react/3x2/GB'
import ES from 'country-flag-icons/react/3x2/ES'

const APP_LOG = '[APP:auth]'

export function AuthModal() {
  const [alias, setAlias] = useState('')
  const [language, setLanguage] = useState<'en' | 'es'>('es')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`${APP_LOG} Submitting form:`, { alias, language })
    
    setError('')
    setLoading(true)

    if (alias.length < 6) {
      setError('Alias must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      await signIn(alias, language)
      console.log(`${APP_LOG} Sign in successful`)
    } catch (err) {
      console.error(`${APP_LOG} Sign in error:`, err)
      setError('Error signing in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px] dark">
        <DialogHeader>
          <DialogTitle>Welcome to Remate Discos</DialogTitle>
          <DialogDescription>
            Choose your alias to start browsing
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="alias">Enter your alias</Label>
            <Input
              id="alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Minimum 6 characters"
              className="bg-muted"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={language === 'en' ? 'default' : 'outline'}
              onClick={() => setLanguage('en')}
              className="flex-1"
            >
              <GB className="w-4 h-4 mr-2" />
              English
            </Button>
            <Button
              type="button"
              variant={language === 'es' ? 'default' : 'outline'}
              onClick={() => setLanguage('es')}
              className="flex-1"
            >
              <ES className="w-4 h-4 mr-2" />
              Español
            </Button>
          </div>
          <Button type="submit" disabled={alias.length < 6 || loading}>
            {loading ? 'Signing in...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}