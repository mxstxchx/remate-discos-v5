// ... existing imports

const signIn = async (alias: string, language: 'en' | 'es') => {
  console.log('Starting signIn:', { alias, language });
  try {
    const { error } = await supabase.from('sessions')
      .upsert({
        user_alias: alias,
        language,
        last_seen_at: new Date().toISOString()
      }, { 
        onConflict: 'user_alias'
      });
    console.log('Upsert response:', { error });

    if (error) throw error;
    
    localStorage.setItem('language', language);
    localStorage.setItem('user_alias', alias);
    
    const isAdmin = alias === '_soyelputoamo_';
    setAuth({ alias, language, isAdmin });
    
    router.push('/welcome-back');
  } catch (error) {
    console.error('Detailed sign in error:', error);
    throw error;
  }
}