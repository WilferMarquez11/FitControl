// authService.js
// Maneja la autenticación tradicional del usuario vía Supabase Auth
import { supabase } from '../lib/supabase/supabaseConfig';

export const authService = {
    /**
     * 1. INICIAR SESIÓN TRADICIONAL
     */
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    /**
     * 2. REGISTRO COMPLETO DE PROPIETARIO (Auth + Inserción en Tabla Pública 'users')
     * 🚨 NUEVO: Registra la cuenta y crea de inmediato el perfil público
     */
    async registerOwner(email, password, fullName) {
        // A. Primero creamos el usuario en la autenticación de Supabase (Auth)
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName.toUpperCase(),
                    role: 'Propietario',
                },
            },
        });

        if (authError) throw authError;

        if (!data?.user) {
            throw new Error('No se pudo crear el usuario en la base de datos de autenticación.');
        }

        const userId = data.user.id;

        // B. Inmediatamente insertamos el perfil en tu tabla pública 'users'
        // Esto previene que falle la FK en 'gyms' al crear el gimnasio posteriormente.
        const { error: dbError } = await supabase
            .from('users')
            .insert({
                id: userId,                      // ID asignado por Supabase Auth
                full_name: fullName.toUpperCase(),// Guardamos el nombre en mayúsculas
                email: email.toLowerCase(),      // Guardamos el email en minúsculas
                role: 'Propietario',             // Rol por defecto asignado
            });

        // Si falla la inserción en la tabla pública, lanzamos el error para que la pantalla lo capture
        if (dbError) throw dbError;

        // Retornamos el objeto 'data' completo de la creación, idéntico al comportamiento anterior
        return data;
    },

    /**
     * 3. REGISTRO INICIAL DE PROPIETARIO (Solo Auth)
     * Se mantiene por compatibilidad si es requerido en otros flujos
     */
    async registerOwnerAuthOnly(email, password, fullName) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: 'Propietario',
                },
            },
        });

        if (error) throw error;
        return data;
    },

    /**
     * 4. RECUPERAR CONTRASEÑA
     */
    async recoverPassword(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        
        if (error) throw error;
        return data;
    },

    /**
     * 5. CERRAR SESIÓN
     */
    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }
};