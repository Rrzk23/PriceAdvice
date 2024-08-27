export interface Price {
    id: string;
    location: string;
    price: number;
    date: string;
  }

export interface User {
    id: string;
    email: string;
    password: string;
    token: string;
}

export interface Credentials {
    email: string;
    password: string;
}

export interface FilterSetting {
    state: string;
    suburb: string;
    zip: string;
    bedrooms: string;
    bathrooms: string;
    garage: string;
    priceMin: string;
    priceMax: string;
    areaMin: string;
    areaMax: string;
}
