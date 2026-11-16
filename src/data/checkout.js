export const FULFILLMENT_OPTIONS = [
  {
    id: 'delivery',
    label: 'Para llevar',
    description: 'Te lo llevamos a la dirección que indiques.',
  },
  {
    id: 'pickup',
    label: 'Recoger',
    description: 'Recógelo en la sucursal que elijas.',
  },
]

export const PAYMENT_METHODS = [
  {
    id: 'cash',
    label: 'Efectivo',
    description: 'Pagas al recibir o al recoger tu pedido.',
  },
  {
    id: 'transfer',
    label: 'Transferencia',
    description: 'Te compartimos los datos por WhatsApp para completar el pago.',
  },
  {
    id: 'card',
    label: 'Tarjeta',
    description: 'Pago de demostración: no se realizará ningún cobro real.',
  },
]
