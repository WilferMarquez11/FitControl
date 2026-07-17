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
   * Sube la imagen del logo al bucket de storage de Supabase 'GYM_LOGOS'
   * usando un formato compatible con React Native (ArrayBuffer).
   */
  async uploadGymLogo(userId, logo_uri) {
    try {
      let fileExt = logo_uri.split('.').pop() || 'jpg';
      fileExt = fileExt.toLowerCase(); // Forzar minúsculas para evitar fallos por extensiones en mayúscula (JPG, PNG)

      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      // Leemos la ruta local como una cadena Base64
      const base64Data = await FileSystem.readAsStringAsync(logo_uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Transformamos esos datos a un búfer binario que Supabase sí entiende
      const arrayBuffer = base64ToArrayBuffer(base64Data);

      // Corrección del tipo MIME estándar para evitar Error 400
      const mimeType = fileExt === 'jpg' || fileExt === 'jpeg' ? 'image/jpeg' : `image/${fileExt}`;

      // ⚡ CORREGIDO: Conectamos directamente con el nombre exacto de tu bucket 'GYM_LOGOS'
      const { error: uploadError } = await supabase.storage
        .from('gym_logos')
        .upload(fileName, arrayBuffer, {
          contentType: mimeType, // Enviamos el header correcto para que Supabase guarde bien el archivo
          upsert: true
        });

      if (uploadError) throw uploadError;

      // ⚡ CORREGIDO: Obtenemos la URL de internet definitiva apuntando al bucket correcto
      const { data: publicUrlData } = supabase.storage
        .from('gym_logos')
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("❌ Error en uploadGymLogo:", error.message);
      throw error;
    }
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
            routine_price,
            address
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Blindaje de formato para relaciones de Supabase
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
  },

  /**
   * Actualiza el logo del gimnasio existente y borra el anterior del storage
   */
  async updateGymLogo(gymId, userId, logoUri) {
    try {
      if (!logoUri) throw new Error("No se proporcionó una ruta de imagen válida.");

      // 1. Obtener los datos actuales del gimnasio para saber si ya tenía un logo previo
      const { data: gym, error: fetchError } = await supabase
        .from('gyms')
        .select('logo_url')
        .eq('id', gymId)
        .single();

      if (fetchError) throw fetchError;

      // 2. Si ya tenía un logo, extraemos su nombre y lo borramos del Storage
      if (gym && gym.logo_url) {
        try {
          // Extraemos de forma segura el nombre del archivo limpiando parámetros de URL si existen
          const urlParts = gym.logo_url.split('/');
          const oldFileName = urlParts[urlParts.length - 1].split('?')[0];
          
          if (oldFileName) {
            console.log("🧹 Intentando borrar archivo del Storage:", oldFileName);
            
            const { data: deleteData, error: deleteError } = await supabase.storage
              .from('gym_logos')
              .remove([oldFileName]);

            if (deleteError) {
              console.error("⚠️ Supabase rechazó el borrado:", deleteError.message);
            } else {
              console.log("✅ Archivo antiguo borrado con éxito del Storage:", deleteData);
            }
          }
        } catch (deleteError) {
          console.warn("⚠️ Error en el proceso de borrado:", deleteError.message);
        }
      }

      // 3. Subir la nueva imagen al storage
      const newLogoUrl = await this.uploadGymLogo(userId, logoUri);

      // 4. Actualizar la tabla 'gyms' con la nueva URL pública obtenida
      const { error: updateError } = await supabase
        .from('gyms')
        .update({ logo_url: newLogoUrl })
        .eq('id', gymId);

      if (updateError) throw updateError;

      return newLogoUrl; 
    } catch (error) {
      console.error("❌ Error en gymService.updateGymLogo:", error.message);
      throw error;
    }
  }
};