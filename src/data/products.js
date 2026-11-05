import combofamiliar from '../assets/offers/combo-familiar.png'
import arrozverduras from '../assets/menu/arrozverduras.png'
import bbqsalsa from '../assets/menu/bbqsalsa.png'
import bebidacola from '../assets/menu/bebidacola.png'
import broenieconhelado from '../assets/menu/broenieconhelado.png'
import cervezaartesanal from '../assets/menu/cervezaartesanal.png'
import cheesecake from '../assets/menu/cheesecake.png'
import chimichurri from '../assets/menu/chimichurri.png'
import costillasbbq from '../assets/menu/costillasbbq.png'
import ensaladacesar from '../assets/menu/ensaladacesar.png'
import limonadanatural from '../assets/menu/limonadanatural.png'
import papasfrancesa from '../assets/menu/papasfrancesa.png'
import pechugaplancha from '../assets/menu/pechugaplancha.png'
import piñasada from '../assets/menu/piñasada.png'
import ribeye from '../assets/menu/ribeye.png'
import salsahumo from '../assets/menu/salsahumo.png'

export const PRODUCTS = [
  // Carnes
  {
    id: 'meat-1',
    category: 'meats',
    name: 'Ribeye a la parrilla',
    description: 'Corte premium de 300g, término a elección.',
    price: 320,
    image: ribeye,
  },
  {
    id: 'meat-2',
    category: 'meats',
    name: 'Costillas BBQ',
    description: 'Costillas de cerdo bañadas en salsa BBQ ahumada.',
    price: 245,
    image: costillasbbq,
  },
  {
    id: 'meat-3',
    category: 'meats',
    name: 'Pechuga a la plancha',
    description: 'Pechuga de pollo marinada con hierbas.',
    price: 180,
    image: pechugaplancha,
  },

  // Bebidas
  {
    id: 'drink-1',
    category: 'drinks',
    name: 'Limonada natural',
    description: 'Limonada fresca preparada al momento.',
    price: 45,
    image: limonadanatural,
  },
  {
    id: 'drink-2',
    category: 'drinks',
    name: 'Refresco de cola',
    description: 'Lata 355ml, bien fría.',
    price: 35,
    image: bebidacola,
  },
  {
    id: 'drink-3',
    category: 'drinks',
    name: 'Cerveza artesanal',
    description: 'Botella 355ml, elaboración local.',
    price: 60,
    image: cervezaartesanal,
  },

  // Postres
  {
    id: 'dessert-1',
    category: 'desserts',
    name: 'Brownie con helado',
    description: 'Brownie tibio con bola de helado de vainilla.',
    price: 85,
    image: broenieconhelado,
  },
  {
    id: 'dessert-2',
    category: 'desserts',
    name: 'Cheesecake de frutos rojos',
    description: 'Rebanada individual con salsa de frutos rojos.',
    price: 90,
    image: cheesecake,
  },
  {
    id: 'dessert-3',
    category: 'desserts',
    name: 'Piña Asada',
    description: 'Piña fresca asada a la parrilla, caramelizada con un toque de canela.',
    price: 75,
    image: piñasada,
  },

  // Acompañantes
  {
    id: 'side-1',
    category: 'sides',
    name: 'Papas a la francesa',
    description: 'Porción clásica, crujientes por fuera.',
    price: 55,
    image: papasfrancesa,
  },
  {
    id: 'side-2',
    category: 'sides',
    name: 'Ensalada César',
    description: 'Lechuga romana, crutones y aderezo César.',
    price: 70,
    image: ensaladacesar,
  },
  {
    id: 'side-3',
    category: 'sides',
    name: 'Arroz con vegetales',
    description: 'Arroz salteado con vegetales de temporada.',
    price: 50,
    image: arrozverduras,
  },

  // Salsas
  {
    id: 'sauce-1',
    category: 'sauces',
    name: 'Salsa BBQ ahumada',
    description: 'Porción extra para acompañar tu corte.',
    price: 20,
    image: bbqsalsa,
  },
  {
    id: 'sauce-2',
    category: 'sauces',
    name: 'Chimichurri',
    description: 'Receta clásica con perejil y ajo.',
    price: 20,
    image: chimichurri,
  },
  {
    id: 'sauce-3',
    category: 'sauces',
    name: 'Salsa de humo',
    description: 'Salsa casera con ahumado de leña, ideal para tus cortes.',
    price: 20,
    image: salsahumo,
  },
]

export const CATEGORIES = [
  { id: 'all', label: 'Todos', image: combofamiliar },
  { id: 'meats', label: 'Carnes', image: ribeye },
  { id: 'drinks', label: 'Bebidas', image: limonadanatural },
  { id: 'desserts', label: 'Postres', image: cheesecake },
  { id: 'sides', label: 'Acompañantes', image: papasfrancesa },
  { id: 'sauces', label: 'Salsas', image: bbqsalsa },
]
