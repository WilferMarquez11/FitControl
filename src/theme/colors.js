export const palette = {
  darkBlue: '#23252e',
  darkYellow: '#f2ab1a',
  darkGreen: '#013024',
  white: '#ffffff',
  black: '#000000',
  red: '#BC0A0A',
  lightGreen: '#7FAF37',

  lightGray: '#cccccc',
  mediumGray: '#999999',
  darkGray: '#888888',
  darkBackground: '#23252E',
  darkInput: '#2E3038',
  darkBorder: '#3A3D46',

  lightGrayInput: '#f0f0f0',   // campos deshabilitados
  lightGreen2: '#e8f5e9',   // fondos de íconos
  overlay: 'rgba(0,0,0,0.5)', // modales
  orange: '#FF9800',   // alertas/abonos
  lightGreen3: '#f0f9f3',   // fondo pago sugerido

  purple: '#5E35B1',          // Icono y borde de Membresías
  lightPurple: '#EDE7F6',     // Fondo de icono de Membresías
  blue: '#1E88E5',            // Icono y borde de Pagos
  lightBlue: '#E3F2FD',       // Fondo de icono de Pagos
  darkOrange: '#FB8C00',      // Icono y borde de Asistencia
  lightOrange: '#FFF3E0',     // Fondo de icono de Asistencia


};
export const lightTheme = {
  backgroundColor: palette.white,               // Fondo claro para la pantalla
  cardBackground: palette.white,            // Fondo blanco para las tarjetas
  textColor: palette.darkBlue,              // Texto principal oscuro
  subTextColor: palette.mediumGray,         // Texto secundario gris
  borderColor: palette.lightGrayInput,      // Borde de tarjetas y inputs claro
  headerBackground: palette.white,          // Fondo de los headers
  dividerColor: palette.lightGrayInput,     // Color de las líneas divisorias
  white: palette.white,
};

export const darkTheme = {
  backgroundColor: palette.darkBackground,  // Fondo oscuro (#23252E)
  cardBackground: palette.darkInput,        // Fondo de tarjeta un poco más claro (#2E3038)
  textColor: palette.white,                 // Texto principal blanco
  subTextColor: palette.lightGray,          // Texto secundario gris claro (#CCCCCC)
  borderColor: palette.darkBorder,          // Borde de tarjetas y inputs oscuro (#3A3D46)
  headerBackground: palette.darkBackground, // Fondo de los headers oscuro
  dividerColor: palette.darkBorder,         // Color de las líneas divisorias oscuras
  white: palette.darkInput,                 // Respaldo para componentes que usaban .white
};