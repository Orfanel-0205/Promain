export const APP_NAME = 'Ka-agapay';

export const RHU_OPTIONS = [
  { value: 'RHU1', label: 'RHU 1', labelFil: 'RHU 1' },
  { value: 'RHU2', label: 'RHU 2', labelFil: 'RHU 2' },
] as const;

export const BARANGAYS_MALASIQUI = [
  'Abonagan', 'Agdao', 'Alac', 'Aliaga', 'Amacalan', 'Anolid', 'Bago', 'Balite',
  'Banaoang', 'Bantog', 'Bari', 'Basing', 'Bautista', 'Bayaoas', 'Binalay', 'Bobon',
  'Bolaoit', 'Bongar', 'Butao', 'Cabaruan', 'Cabueldatan', 'Calbueg', 'Canan', 'Canaoalan',
  'Candor', 'Caramutan', 'Cardona', 'Cayanga', 'Dagupan', 'Dulig', 'Goliman', 'Gomez',
  'Guiguilonen', 'Guilig', 'Inamotan', 'Landas', 'Lepa', 'Lepas', 'Limboy', 'Mabulitec',
  'Malimpec', 'Manggan', 'Nalsian', 'Nansangaan', 'Olea', 'Pacuan', 'Palapar', 'Palong',
  'Pamaranum', 'Pangdel', 'Pangpang', 'Pasima', 'Payar', 'Poblacion', 'Polong', 'Potungan',
  'San Julian', 'Taboy', 'Talospatang', 'Taloy', 'Tambo', 'Tebag', 'Tococ', 'Tombod',
  'Umando', 'Viado', 'Waig', 'Warey',
];

export const SERVICE_TYPES = [
  { value: 'consultation', label: 'Konsultasyon', labelEn: 'Consultation' },
  { value: 'vaccination', label: 'Bakuna', labelEn: 'Vaccination' },
  { value: 'immunization', label: 'Immunization', labelEn: 'Immunization' },
  { value: 'feeding', label: 'Feeding Program', labelEn: 'Feeding Program' },
  { value: 'family_planning', label: 'Family Planning', labelEn: 'Family Planning' },
  { value: 'prenatal', label: 'Prenatal', labelEn: 'Prenatal' },
  { value: 'other', label: 'Iba pa', labelEn: 'Other' },
] as const;

export const SEX_OPTIONS = [
  { value: 'male', label: 'Lalaki', labelEn: 'Male' },
  { value: 'female', label: 'Babae', labelEn: 'Female' },
  { value: 'other', label: 'Iba pa', labelEn: 'Other' },
] as const;

export const TIME_BLOCKS = [
  { value: 'AM', label: 'Umaga (AM)', labelEn: 'Morning (AM)' },
  { value: 'PM', label: 'Hapon (PM)', labelEn: 'Afternoon (PM)' },
] as const;

export const FEEDBACK_OPTIONS = [
  { value: 'fast', label: 'Mabilis ang serbisyo', labelEn: 'Fast service' },
  { value: 'slow', label: 'Matagal ang pila', labelEn: 'Long wait' },
  { value: 'easy', label: 'Madaling gamitin ang app', labelEn: 'Easy to use app' },
] as const;

export const CHATBOT_DISCLAIMER =
  'Hindi ako kapalit ng doktor. Para sa diagnosis at gamot, magpunta sa RHU o konsultahin ang doktor.';
