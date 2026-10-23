import arrozverduras from '../assets/img/arrozverduras.png'
import bbqsalsa from '../assets/img/bbqsalsa.png'
import bebidacola from '../assets/img/bebidacola.png'
import broenieconhelado from '../assets/img/broenieconhelado.png'
import cervezaartesanal from '../assets/img/cervezaartesanal.png'
import cheesecake from '../assets/img/cheesecake.png'
import chimichurri from '../assets/img/chimichurri.png'
import costillasbbq from '../assets/img/costillasbbq.png'
import ensaladacesar from '../assets/img/ensaladacesar.png'
import limonadanatural from '../assets/img/limonadanatural.png'
import papasfrancesa from '../assets/img/papasfrancesa.png'
import pechugaplancha from '../assets/img/pechugaplancha.png'
import ribeye from '../assets/img/ribeye.png'

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
]

export const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'meats', label: 'Carnes' },
  { id: 'drinks', label: 'Bebidas' },
  { id: 'desserts', label: 'Postres' },
  { id: 'sides', label: 'Acompañantes' },
  { id: 'sauces', label: 'Salsas' },
]
