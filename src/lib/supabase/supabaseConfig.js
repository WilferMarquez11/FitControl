import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Expo lee automáticamente las variables que empiezan con EXPO_PUBLIC_
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Inicializamos el cliente único de Supabase para toda la app FitControl
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,       // 💾 Guarda la sesión de forma segura y nativa en el celular
    autoRefreshToken: true,      // 🔄 Refresca el token automáticamente en segundo plano
    persistSession: true,        // 🔑 Mantiene al usuario logueado aunque cierre la app
    detectSessionInUrl: false,   // Evita comportamientos extraños en entornos móviles
  },
});