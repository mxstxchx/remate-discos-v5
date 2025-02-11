'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface WelcomeBackModalProps {
  alias: string
  isAdmin: boolean
}

export function WelcomeBackModal({ alias, isAdmin }: WelcomeBackModalProps) {
  const router = useRouter()
  const { signOut } = useAuth()
  const supabase = createClientComponentClient()

  const handleContinue = async () => {
    await supabase.from('sessions')
      .update({ welcome_seen: true })
      .eq('user_alias', alias)
    
    const destination = isAdmin ? '/admin' : '/'
    router.replace(destination)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <Dialog open={true}>
      <DialogContent onPointerDownOutside={e => e.preventDefault()} className="sm:max-w-[425px] dark">
        <DialogHeader>
          <DialogTitle>Welcome back!</DialogTitle>
          <DialogDescription>
            Continue browsing as {alias}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={handleContinue} className="w-full">
            Continue as {alias}
          </Button>
          <Button variant="outline" onClick={handleSignOut} className="w-full">
            Sign in as different alias
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}