const BASE = 'https://fakestoreapi.com'

export const getProducts    = ()    => fetch(`${BASE}/products`).then(r => r.json())
export const getProduct     = (id)  => fetch(`${BASE}/products/${id}`).then(r => r.json())
export const getCategories  = ()    => fetch(`${BASE}/products/categories`).then(r => r.json())
export const getByCategory  = (cat) => fetch(`${BASE}/products/category/${encodeURIComponent(cat)}`).then(r => r.json())
export const getFeatured    = (n=8) => fetch(`${BASE}/products?limit=${n}`).then(r => r.json())
