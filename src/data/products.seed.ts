export interface SeedReview {
    name: string;
    rating: number;
    comment: string;
}

export interface SeedProduct {
    name: string;
    image: string;
    brand: string;
    category: string;
    color: string;
    colorHex: string;
    description: string;
    details: string[];
    price: number;
    countInStock: number;
    reviews: SeedReview[];
}

export const seedProducts: SeedProduct[] = [
    {
        name: "Polerón Dinosaurio",
        image: "https://http2.mlstatic.com/D_NQ_NP_865267-MLC78045207017_072024-O.webp",
        brand: "CoolKid",
        category: "Polerones",
        color: "Verde",
        colorHex: "#22C55E",
        description:
            "Polerón polar infantil con estampado de dinosaurios. Su interior suave mantiene el calor sin dar sensación de peso.",
        details: ["Capucha con orejas", "Bolsillo canguro", "Interior polar"],
        price: 15990,
        countInStock: 25,
        reviews: [
            {
                name: "Camila R.",
                rating: 5,
                comment: "La tela es muy suave y abriga justo lo necesario. A mi hijo le encantó el dinosaurio.",
            },
            {
                name: "Diego M.",
                rating: 4,
                comment: "Llegó en el plazo indicado y la talla corresponde. Buena calidad por el precio.",
            },
            {
                name: "Valentina P.",
                rating: 5,
                comment: "Resistió varios lavados sin perder color ni suavidad. Lo volvería a comprar.",
            },
        ],
    },
    {
        name: "Camiseta Arcoíris",
        image: "https://tenlittle.com/cdn/shop/files/ten-little-kids-wear-primary-fleece-crew-sweatshirt-heather-cherry1.jpg?v=1738612269",
        brand: "MiniCloud",
        category: "Camisetas",
        color: "Multicolor",
        colorHex: "#A855F7",
        description:
            "Camiseta de algodón orgánico con estampado arcoíris. Liviana, fresca y pensada para el uso diario.",
        details: ["100% algodón orgánico", "Cuello redondo reforzado"],
        price: 8990,
        countInStock: 40,
        reviews: [
            {
                name: "Josefa S.",
                rating: 5,
                comment: "El algodón se siente muy suave y no se deformó después del primer lavado.",
            },
            {
                name: "Matías L.",
                rating: 4,
                comment: "Los colores son tal como se ven en la foto. Le quedó perfecta a mi hija.",
            },
        ],
    },
    {
        name: "Pantalón Cargo Estrella",
        image: "https://dedoles.es/cdn/shop/files/b739265f3b3c09c316be63c586792b50ab5fcf8a.webp?v=1771896779&width=1946",
        brand: "CoolKid",
        category: "Pantalones",
        color: "Azul",
        colorHex: "#3B82F6",
        description:
            "Pantalón cargo resistente con bolsillos laterales y cintura elástica. Ideal para jugar y moverse con libertad.",
        details: ["Tres bolsillos", "Rodillas reforzadas", "Cintura elástica"],
        price: 12990,
        countInStock: 18,
        reviews: [
            {
                name: "Tomás C.",
                rating: 5,
                comment: "Las rodillas reforzadas han aguantado el recreo sin problemas. Muy resistente.",
            },
            {
                name: "Antonia V.",
                rating: 4,
                comment: "La cintura elástica es cómoda y la talla quedó exacta.",
            },
        ],
    },
    {
        name: "Parka Nube Lluviosa",
        image: "https://ficcus.vtexassets.com/arquivos/ids/407136/26202670202_1.jpg?v=639101481003500000",
        brand: "StormKids",
        category: "Parkas",
        color: "Celeste",
        colorHex: "#93C5FD",
        description:
            "Parka impermeable con forro térmico desmontable. Protege de la lluvia y del frío en los días de invierno.",
        details: ["Impermeable 3000mm", "Forro desmontable", "Reflector nocturno"],
        price: 34990,
        countInStock: 10,
        reviews: [
            {
                name: "Camila R.",
                rating: 5,
                comment: "Nos tocó un día de lluvia fuerte y mi hija llegó completamente seca.",
            },
            {
                name: "Rodrigo P.",
                rating: 4,
                comment: "El forro desmontable es muy útil. La uso con y sin forro según la temperatura.",
            },
            {
                name: "Fernanda G.",
                rating: 5,
                comment: "El reflector se ve muy bien de noche. Se nota que está bien fabricada.",
            },
        ],
    },
    {
        name: "Gorro Oso Polar",
        image: "https://www.notanotherbill.com/cdn/shop/files/Kids-Bucket-Hat-Sand-1200W.jpg?v=1722510924",
        brand: "MiniCloud",
        category: "Accesorios",
        color: "Blanco",
        colorHex: "#E5E7EB",
        description:
            "Gorro de lana con orejas de oso polar y forro interior de polar. Perfecto para las mañanas frías.",
        details: ["Lana acrílica suave", "Forro de polar", "Talla única infantil"],
        price: 5990,
        countInStock: 60,
        reviews: [
            {
                name: "Daniela T.",
                rating: 5,
                comment: "Es súper abrigador y las orejitas se ven adorables. No pica la lana.",
            },
            {
                name: "Ignacio R.",
                rating: 4,
                comment: "Se ajusta bien y cubre las orejas. Buen precio para la calidad.",
            },
        ],
    },
    {
        name: "Vestido Flor Silvestre",
        image: "https://www.littleolin.com/cdn/shop/files/PhotoRoom_20240110_1145411.jpg?v=1724610527",
        brand: "Petite Fleur",
        category: "Vestidos",
        color: "Rosa",
        colorHex: "#F9A8D4",
        description:
            "Vestido estampado de flores con can-can interior y cierre trasero. Fresco y cómodo para ocasiones especiales.",
        details: ["Tejido fresco", "Can-can incluido", "Cierre trasero"],
        price: 13990,
        countInStock: 22,
        reviews: [
            {
                name: "Valentina P.",
                rating: 5,
                comment: "El can-can le da una forma preciosa y el cierre trasero es fácil de usar.",
            },
            {
                name: "Carolina M.",
                rating: 4,
                comment: "El estampado es delicado y el tejido es liviano. Ideal para primavera.",
            },
        ],
    },
    {
        name: "Zapatillas Rayo Veloz",
        image: "https://4kidspoint.es/cdn/shop/files/img_front_1240x1240_68dda12d-e06f-4da1-aa36-e85cae2bfdd1.webp?v=1783420742",
        brand: "FastKid",
        category: "Calzado",
        color: "Negro",
        colorHex: "#1E293B",
        description:
            "Zapatillas deportivas livianas con cierre de velcro y suela antideslizante. Cómodas para correr y jugar.",
        details: ["Cierre velcro", "Plantilla acolchada", "Suela antideslizante"],
        price: 24990,
        countInStock: 15,
        reviews: [
            {
                name: "Matías L.",
                rating: 5,
                comment: "Muy livianas y fáciles de poner. La plantilla acolchada le gustó mucho.",
            },
            {
                name: "Paula S.",
                rating: 4,
                comment: "La suela agarra bien en el patio y el velcro sigue firme después de un mes.",
            },
            {
                name: "Andrés F.",
                rating: 5,
                comment: "Talla correcta y se ven de buena calidad. Las recomiendo.",
            },
        ],
    },
    {
        name: "Calcetines Pack Astronauta",
        image: "https://thegreencrib.com/cdn/shop/files/FrugiSocksDinosaur.jpg?v=1741983356",
        brand: "MiniCloud",
        category: "Accesorios",
        color: "Gris",
        colorHex: "#9CA3AF",
        description:
            "Pack de 3 pares de calcetines con estampados espaciales y refuerzo en el talón. Suaves y duraderos.",
        details: ["Pack x3", "Algodón con elastano", "Refuerzo en talón"],
        price: 6990,
        countInStock: 80,
        reviews: [
            {
                name: "Josefa S.",
                rating: 5,
                comment: "Los estampados son muy entretenidos y el algodón es suave. Buen pack.",
            },
            {
                name: "Tomás C.",
                rating: 4,
                comment: "El refuerzo del talón se nota. Han aguantado bien los lavados.",
            },
        ],
    },
];
