// userService
// Consultas relacionadas con la tabla `users` (perfil del usuario en tu negocio,
// distinto de auth.users). Se usa para decidir a dónde navegar tras el login.
import { supabase } from '../lib/supabase/supabaseConfig';

export const userService = {
  /**
   * Obtiene el perfil público del usuario desde la tabla de negocio 'users'.
   * Útil para validar su rol ('Propietario', 'Entrenador', etc.) y decidir rutas.
   */
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    // Si no encuentra el perfil (código PGRST116), manejamos un retorno nulo limpio en vez de romper la app
    if (error && error.code === 'PGRST116') return null; 
    if (error) throw error;
    
    return data;
  }
};