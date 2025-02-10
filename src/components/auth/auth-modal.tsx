'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GB, ES } from 'country-flag-icons/react/3x2';
import supabase from '@/lib/supabase';
import { logger } from '@/lib/logger';

export function AuthModal() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [alias, setAlias] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    logger.dev('auth', 'Attempting login with alias:', alias);

    try {
      if (alias === '_soyelputoamo_') {
        const { error: upsertError } = await supabase
          .from('sessions')
          .upsert(
            {
              user_alias: alias,
              language: i18n.language || 'es',
              is_admin: true,
              last_seen_at: new Date().toISOString()
            },
            { onConflict: 'user_alias' }
          );

        if (upsertError) throw upsertError;
        logger.app('auth', 'Admin login successful');
        router.push('/admin');
        return;
      }

      // Use upsert for regular users too, but check existence first
      const { data: existingSession } = await supabase
        .from('sessions')
        .select('user_alias')
        .eq('user_alias', alias)
        .maybeSingle();

      if (existingSession) {
        logger.dev('auth', 'Alias already exists:', alias);
        setError(t('auth.aliasInUse'));
        setIsLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('sessions')
        .insert({
          user_alias: alias,
          language: i18n.language || 'es',
          is_admin: false
        });

      if (insertError) {
        logger.dev('auth', 'Insert error:', insertError);
        throw insertError;
      }

      logger.app('auth', 'Regular user login successful');
      router.push('/browse');

    } catch (err) {
      logger.dev('auth', 'Error in handleSubmit:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    logger.dev('auth', 'Toggling language to:', newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <Dialog open>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-center">
            Remate Discos
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder={t('auth.enterAlias')}
              value={alias}
              onChange={(e) => {
                setAlias(e.target.value);
                if (error) setError('');
              }}
              className="bg-muted border-border text-gray-100"
              minLength={6}
              required
            />
            {error && (
              <p className="mt-1 text-sm text-status-error">{error}</p>
            )}
          </div>
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="ghost"
              onClick={toggleLanguage}
              className="p-2"
            >
              {i18n.language === 'en' ? (
                <GB className="w-6 h-4" />
              ) : (
                <ES className="w-6 h-4" />
              )}
            </Button>
            <Button
              type="submit"
              disabled={alias.length < 6 || isLoading}
              className="bg-primary hover:bg-primary-dark text-black font-medium"
            >
              {isLoading ? t('common.loading') : t('common.continue')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}