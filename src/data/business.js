// Datos generales del negocio. Los usan el footer, el menú lateral y el chatbot.
// Son datos de ejemplo: reemplázalos por los reales.
export const BUSINESS = {
  name: 'BACON JR.',
  address: 'Av. Principal #123, Neiva Huila, Colombia',
  phone: '+57 310 123 4567',
  whatsappUrl: 'https://wa.me/573101234567',
  hoursText: 'Lun a Jue 12:00 – 22:00 · Vie a Dom 12:00 – 23:00',
  deliveryTime: '30 a 45 minutos',
  // Hora de apertura y cierre por día (0 = domingo … 6 = sábado).
  schedule: {
    0: [12, 23],
    1: [12, 22],
    2: [12, 22],
    3: [12, 22],
    4: [12, 22],
    5: [12, 23],
    6: [12, 23],
  },
}
