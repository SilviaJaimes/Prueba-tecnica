const API_BASE_URL = "http://localhost:5067/api"

// Función para obtener el token del localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Función para hacer peticiones con autenticación
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken()

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  // Si el token ha expirado, redirigir al login
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    throw new Error("Token expirado")
  }

  // Para DELETE, si es 200 o 204, considerarlo exitoso
  if (options.method === "DELETE" && (response.status === 200 || response.status === 204)) {
    return { success: true }
  }

  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
    } catch {
      errorData = { message: `Error ${response.status}` }
    }
    console.error("API Error:", errorData)
    throw new Error(errorData.message || errorData.title || `Error ${response.status}`)
  }

  // Para respuestas vacías (como DELETE exitoso), retornar objeto de éxito
  const contentType = response.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    return { success: true }
  }

  return response.json()
}

// Servicios de Autenticación
export const authService = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Error al iniciar sesión")
    }

    return response.json()
  },
}

// Servicios de Categorías
export const categoriesService = {
  getAll: () => apiRequest("/categories"),
  getById: (id: number) => apiRequest(`/categories/${id}`),
  create: (data: { name: string }) =>
    apiRequest("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: { name: string }) =>
    apiRequest(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest(`/categories/${id}`, {
      method: "DELETE",
    }),
}

// Servicios de Proveedores
export const suppliersService = {
  getAll: () => apiRequest("/suppliers"),
  getById: (id: number) => apiRequest(`/suppliers/${id}`),
  create: (data: { name: string; contact: string }) =>
    apiRequest("/suppliers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: { name: string; contact: string }) =>
    apiRequest(`/suppliers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest(`/suppliers/${id}`, {
      method: "DELETE",
    }),
}

// Servicios de Productos
export const productsService = {
  getAll: () => apiRequest("/products"),
  getById: (id: number) => apiRequest(`/products/${id}`),
  create: (data: {
    name: string
    description: string
    price: number
    categoryId: number
    supplierId: number
  }) =>
    apiRequest("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    id: number,
    data: {
      name: string
      description: string
      price: number
      categoryId: number
      supplierId: number
    },
  ) =>
    apiRequest(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest(`/products/${id}`, {
      method: "DELETE",
    }),
}

// Servicios de Órdenes
export const ordersService = {
  getAll: () => apiRequest("/orders"),
  getById: (id: number) => apiRequest(`/orders/${id}`),
  create: (data: {
    productId: number
    quantity: number
    totalPrice: number
  }) =>
    apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    id: number,
    data: {
      productId: number
      quantity: number
      totalPrice: number
    },
  ) =>
    apiRequest(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest(`/orders/${id}`, {
      method: "DELETE",
    }),
}
