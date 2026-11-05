import costillasBbq from '../assets/offers/costillas-bbq.png'
import comboFamiliar from '../assets/offers/combo-familiar.png'
import happyHour from '../assets/offers/happy-hour.png'

export const OFFERS = [
  {
    id: 'offer-costillas',
    title: 'Martes de Costillas',
    name: 'Costillas BBQ para dos',
    description: '2x1 en costillas BBQ todos los martes.',
    longDescription:
      'Dos porciones de costillas de cerdo ahumadas al barril, bañadas en nuestra salsa BBQ de la casa, con papas a la francesa.',
    originalPrice: 490,
    price: 245,
    image: costillasBbq,
    tag: '2x1',
  },
  {
    id: 'offer-combo-familiar',
    title: 'Combo Familiar',
    name: 'Combo Familiar',
    description: 'Ribeye + papas + ensalada para 6 personas.',
    longDescription:
      'Ribeye, papas a la francesa y ensalada fresca para 6 personas.',
    originalPrice: 890,
    price: 690,
    image: comboFamiliar,
    tag: 'Para 6',
  },
  {
    id: 'offer-happy-hour',
    title: 'Happy Hour',
    name: 'Happy Hour',
    description: '2x1 en bebidas de lunes a viernes 4-7pm.',
    longDescription:
      'Dos bebidas por el precio de una, de lunes a viernes entre 4:00 y 7:00 pm.',
    originalPrice: 120,
    price: 60,
    image: happyHour,
    tag: '2x1',
  },
]

export const DAILY_OFFER = OFFERS[0]
