// Carta de coctelería. Las recetas, fotos e ingredientes vienen de TheCocktailDB
// (https://www.thecocktaildb.com); aquí solo elegimos qué cócteles ofrecer y a qué precio.

// Precio de venta por tipo (TheCocktailDB no maneja precios).
export const COCKTAIL_PRICES = {
  alcoholic: 95,
  nonAlcoholic: 65,
}

export const COCKTAIL_TABS = [
  { id: 'alcoholic', label: 'Con alcohol' },
  { id: 'nonAlcoholic', label: 'Sin alcohol' },
]

// IDs de TheCocktailDB, en el orden en que se muestran.
// La versión gratuita de la API no permite listar todos los cócteles con alcohol,
// por eso la carta se define aquí. Cualquier otro se puede encontrar con el buscador.
export const FEATURED_COCKTAILS = {
  alcoholic: [
    '11007', // Margarita
    '11000', // Mojito
    '17207', // Piña Colada
    '11288', // Cuba Libre
    '178343', // Michelada
    '17253', // Paloma
    '11202', // Caipirinha
    '11006', // Daiquiri
    '11009', // Moscow Mule
    '13621', // Tequila Sunrise
    '178325', // Aperol Spritz
    '11004', // Whiskey Sour
    '11001', // Old Fashioned
    '17196', // Cosmopolitan
    '11003', // Negroni
    '11690', // Mai Tai
    '13020', // Sangría
    '178365', // Gin Tonic
    '11113', // Bloody Mary
    '17204', // Long Island Iced Tea
  ],
  nonAlcoholic: [
    '13036', // Strawberry Lemonade
    '12704', // Limeade
    '12618', // Orangeade
    '12716', // Mango Orange Smoothie
    '12698', // Lassi de mango
    '12786', // Thai Iced Tea
    '12770', // Iced Coffee
    '12862', // Aloha Fruit Punch
    '12710', // Apple Berry Smoothie
    '12714', // Kiwi Papaya Smoothie
    '12656', // Banana Strawberry Shake
    '12670', // Fruit Cooler
    '12718', // Pineapple Gingerale Smoothie
    '12890', // Cranberry Punch
  ],
}

// Traducción de los ingredientes más comunes (la API los entrega en inglés).
export const INGREDIENT_ES = {
  'tequila': 'Tequila',
  'triple sec': 'Triple sec',
  'lime juice': 'Jugo de lima',
  'lime': 'Lima',
  'lemon': 'Limón',
  'lemon juice': 'Jugo de limón',
  'salt': 'Sal',
  'light rum': 'Ron blanco',
  'white rum': 'Ron blanco',
  'dark rum': 'Ron oscuro',
  'rum': 'Ron',
  'sugar': 'Azúcar',
  'powdered sugar': 'Azúcar glas',
  'sugar syrup': 'Jarabe de azúcar',
  'simple syrup': 'Jarabe simple',
  'mint': 'Hierbabuena',
  'soda water': 'Agua con gas',
  'carbonated water': 'Agua con gas',
  'club soda': 'Agua con gas',
  'ice': 'Hielo',
  'crushed ice': 'Hielo picado',
  'coconut milk': 'Leche de coco',
  'cream of coconut': 'Crema de coco',
  'pineapple juice': 'Jugo de piña',
  'pineapple': 'Piña',
  'coca-cola': 'Coca-Cola',
  'cola': 'Cola',
  'cachaca': 'Cachaça',
  'vodka': 'Vodka',
  'ginger beer': 'Cerveza de jengibre',
  'ginger ale': 'Ginger ale',
  'orange juice': 'Jugo de naranja',
  'orange': 'Naranja',
  'orange peel': 'Cáscara de naranja',
  'grenadine': 'Granadina',
  'grapefruit juice': 'Jugo de toronja',
  'grapefruit soda': 'Soda de toronja',
  'aperol': 'Aperol',
  'prosecco': 'Prosecco',
  'blended whiskey': 'Whisky',
  'bourbon': 'Bourbon',
  'whiskey': 'Whisky',
  'egg white': 'Clara de huevo',
  'bitters': 'Amargo de angostura',
  'angostura bitters': 'Amargo de angostura',
  'water': 'Agua',
  'gin': 'Ginebra',
  'tonic water': 'Agua tónica',
  'campari': 'Campari',
  'sweet vermouth': 'Vermut rojo',
  'dry vermouth': 'Vermut seco',
  'cranberry juice': 'Jugo de arándano',
  'cointreau': 'Cointreau',
  'red wine': 'Vino tinto',
  'brandy': 'Brandy',
  'beer': 'Cerveza',
  'tomato juice': 'Jugo de tomate',
  'worcestershire sauce': 'Salsa inglesa',
  'tabasco sauce': 'Tabasco',
  'hot sauce': 'Salsa picante',
  'celery salt': 'Sal de apio',
  'pepper': 'Pimienta',
  'cherry': 'Cereza',
  'maraschino cherry': 'Cereza marrasquino',
  'strawberries': 'Fresas',
  'strawberry': 'Fresa',
  'banana': 'Banano',
  'mango': 'Mango',
  'milk': 'Leche',
  'yoghurt': 'Yogur',
  'yogurt': 'Yogur',
  'honey': 'Miel',
  'apple': 'Manzana',
  'apple juice': 'Jugo de manzana',
  'kiwi': 'Kiwi',
  'papaya': 'Papaya',
  'coffee': 'Café',
  'tea': 'Té',
  'black tea': 'Té negro',
  'cinnamon': 'Canela',
  'cream': 'Crema',
  'vanilla ice-cream': 'Helado de vainilla',
  'ice-cream': 'Helado',
  'lemonade': 'Limonada',
  'cranberries': 'Arándanos',
}
