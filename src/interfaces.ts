// brands
export interface Brand {
    id: number,
    name_ru: string,
    name_orig: string,
    name: string,
    image: string,
    url: string,
}
export interface importedBrands {
    brands: Brand[],
}

// categories
export interface Category {
    id: number,
    name: string,
    slug: string,
    discounts: number,
}
export interface importedCategories {
    categories: Category[],
}

// cities
export interface City {
    id: number,
    name: string,
    name2: string,
    name3: string,
    slug: string,
    state: string,
    region: string,
    lat: number,
    lng: number,
    diff: string,
    capital: number
}
export interface importedCities {
    cities: City[],
}

// discounts
export interface Discount {
    id: number,
    name: string,
    slug: string,
    start_date: string,
    end_date: string,
    days_title: string,
    color: number,
    date: string,
    discount_url: string,
}
export interface importedDiscounts {
    discounts: Discount[],
}

// product images
export interface ProductImage {
    url?: string,
    src?: string,
    w: number,
    h: number,
    filesize?: number,
}
export interface importedProductImages {
    productImages: ProductImage[],
}

// shops
export interface Shop {
    id: number,
    name: string,
    slug: string,
    website: string,
    image: string,
    image_100: string,
    image_50: string,
    image_25: string,
    image_map: string,
    url: string,
    categories_id?: number,
    discounts?: number,
}
export interface importedShops {
    shops: Shop[],
}

// products
export interface Product {
    id: number,
    slug: string,
    discounts_id: number,
    externalurl: string,
    pricebefore: number,
    priceafter?: number,
    discount?: number,
    discount_type?: string,
    image_contains_price: number,
    startdate?: string,
    enddate?: string,
    catalogs_id?: number,
    quantity?: number,
    quantity_unit: string,
    name2: string,
    name: string,
    image336?: ProductImage,
    imagefull?: ProductImage,
    countPlus: number,
    countMinus: number,
    shops_ids?: [],
    shops?: [],
    comments: number,
    daystitle?: string,
    date?: string,
    discount_name?: string,
    color?: number,
    units: string,
    noted: number,
    notalladdr: number,
    addresses_image?: ProductImage,
    url: string,
    phone: string,
    liked: number,
    desc: string,
    discount_url?: string,
    num: number,
    loggedInUserId?: number,
    ask_list_before_add: number,
    totalCount: boolean,
    brands?: [],
    pcategories?: [],
    quantity_unit_val?: string,
}
export interface importedProducts {
    products: Product[],
}