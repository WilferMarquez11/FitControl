// src/services/gymService.js
import { supabase } from '../lib/supabase/supabaseConfig';
import * as FileSystem from 'expo-file-system/legacy'; // Mantiene la importación con /legacy

// Función ayudante para convertir cadenas Base64 a ArrayBuffer (Evita el error de Blobs en React Native)
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const gymService = {
  /**
   * Sube la imagen del logo al bucket de storage de Supabase 'gym_logos'
   * usando un formato compatible con React Native (ArrayBuffer).
   */
  async uploadGymLogo(userId, logo_uri) {
    let fileExt = logo_uri.split('.').pop() || 'jpg';
    fileExt = fileExt.toLowerCase(); // Forzar minúsculas para evitar fallos por extensiones en mayúscula (JPG, PNG)
    
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    
    // Leemos la ruta local como una cadena Base64
    const base64Data = await FileSystem.readAsStringAsync(logo_uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Transformamos esos datos a un búfer binario que Supabase sí entiende
    const arrayBuffer = base64ToArrayBuffer(base64Data);

    // ── CORRECCIÓN DEL TIPO MIME ESTÁNDAR PARA EVITAR ERROR 400 ──
    const mimeType = fileExt === 'jpg' || fileExt === 'jpeg' ? 'image/jpeg' : `image/${fileExt}`;

    // Conectamos directamente con tu bucket 'gym_logos'
    const { error: uploadError } = await supabase.storage
      .from('gym_logos') 
      .upload(fileName, arrayBuffer, { 
        contentType: mimeType, // Enviamos el header correcto para que Supabase guarde bien el archivo
        upsert: true 
      });

    if (uploadError) throw uploadError;

    // Obtenemos la URL de internet definitiva de forma limpia
    const { data: publicUrlData } = supabase.storage
      .from('gym_logos')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  },

  /**
   * Crea el gimnasio en la tabla 'gyms' y vincula su ID al perfil del usuario en 'users'.
   */
  async createGymAndLinkUser({ userId, gym_name, country, state, city, routine_price, address, logo_uri }) {
    let logo_url = null;

    if (logo_uri) {
      logo_url = await this.uploadGymLogo(userId, logo_uri);
    }

    // Insertar en la tabla 'gyms' asegurando la conversión limpia de datos
    const { data: gym, error: gymError } = await supabase
      .from('gyms')
      .insert({
        gym_name,
        country,
        state,
        city,
        routine_price: parseFloat(routine_price) || 0,
        address: address ? address.trim() : null, // Si está vacío, se guarda como NULL de forma limpia
        logo_url,
        created_by: userId,
      })
      .select()
      .single();

    if (gymError) throw gymError;

    // Actualizar la tabla 'users' vinculando el gym_id al propietario actual
    const { error: userError } = await supabase
      .from('users')
      .update({ gym_id: gym.id })
      .eq('id', userId);

    if (userError) throw userError;

    return gym;
  },

  /**
   * Obtiene los datos del gimnasio (nombre, logo) creados por el usuario.
   * Se utiliza en el PanelOwnerScreen para pintar la UI personalizada del propietario.
   */
  async getGymByOwner(userId) {
    try {
      // 1. Consultamos el usuario y su gimnasio asociado
      const { data, error } = await supabase
        .from('users')
        .select(`
          gym_id,
          gyms:gym_id (
            id,
            gym_name,
            logo_url,
            country,
            state,
            city,
            routine_price
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

      // 🚨 BLINDAJE DE FORMATO: 
      // Supabase a veces retorna la relación como un Array (si hay políticas genéricas)
      // o como un Objeto directo. Nos aseguramos de devolver siempre un objeto plano.
      let gymData = data?.gyms;
      
      if (Array.isArray(gymData)) {
        gymData = gymData[0];
      }

      console.log("=== GYM SERVICE: DATOS DE GIMNASIO PROCESADOS ===", gymData);
      return gymData || null;

    } catch (error) {
      console.error('Error en getGymByOwner:', error.message);
      return null;
    }
  }
};