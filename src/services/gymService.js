import { supabase } from '../lib/supabase/supabaseConfig';
import * as FileSystem from 'expo-file-system/legacy'; // 👈 ¡Agregado /legacy al final!

// Función ayudante para convertir cadenas Base64 a ArrayBuffer (Evita el error de Blobs)
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
    const fileExt = logo_uri.split('.').pop() || 'jpg';
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    
    // 🚨 SOLUCIÓN AL ERROR: Leemos la ruta local como una cadena Base64
    const base64Data = await FileSystem.readAsStringAsync(logo_uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Transformamos esos datos a un búfer binario que Supabase sí entiende
    const arrayBuffer = base64ToArrayBuffer(base64Data);

    // Conectamos directamente con tu bucket 'gym_logos'
    const { error: uploadError } = await supabase.storage
      .from('gym_logos') 
      .upload(fileName, arrayBuffer, { 
        contentType: `image/${fileExt}`,
        upsert: true 
      });

    if (uploadError) throw uploadError;

    // Obtenemos la URL de internet definitiva
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
        address: address ? address.trim() : null, // 💡 Si está vacío, se guarda como NULL de forma limpia
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
  }
};