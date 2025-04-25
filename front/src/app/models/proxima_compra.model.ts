export interface Categoria {
  categoria: any;
  title: string;
  productes: Producte[];
}

export interface Producte {
  titol: string;
  diesCompra: string;
  tags: string[];
  afegitUser: boolean;
  producte: Record<string, Supermercat>;
  supermercat: string;
  [key: string]: any; // Esto permite el acceso dinámico => producte.producte[variableSupermercat].id
}

export interface DiaCompra {
  mes: boolean[];
}

export interface Supermercat {
  unitats: number;
  id: string;
  image: string;
}

export let dummyProducte: Producte = {
  titol: '',
  diesCompra: '',
  tags: [''],
  afegitUser: false,
  supermercat: 'mercadona',
  producte: {
    mercadona: { unitats: 0, id: '', image: '' },
    carrefour: { unitats: 0, id: '', image: '' },
  },
};

export let dummyCategory: Categoria = {
  title: '',
  categoria: '',
  productes: [dummyProducte],
};
