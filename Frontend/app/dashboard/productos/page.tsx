"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Plus, Search, Trash2, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { productsService, categoriesService, suppliersService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  description: string
  price: number
  categoryId: number
  supplierId: number
  category?: {
    id: number
    name: string
  }
  supplier?: {
    id: number
    name: string
    contact: string
  }
}

interface Category {
  id: number
  name: string
}

interface Supplier {
  id: number
  name: string
  contact: string
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    categoryId: 0,
    supplierId: 0,
  })
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log("🔄 Cargando productos, categorías y proveedores...")

      const [productsData, categoriesData, suppliersData] = await Promise.all([
        productsService.getAll(),
        categoriesService.getAll(),
        suppliersService.getAll(),
      ])

      console.log("📦 Productos cargados (raw):", productsData)
      console.log("🏷️ Categorías cargadas:", categoriesData)
      console.log("🚚 Proveedores cargados:", suppliersData)

      const productsArray = Array.isArray(productsData) ? productsData : []
      const categoriesArray = Array.isArray(categoriesData) ? categoriesData : []
      const suppliersArray = Array.isArray(suppliersData) ? suppliersData : []

      const productsWithRelations = productsArray.map((product) => {
        const category = categoriesArray.find((c) => c.id === product.categoryId)
        const supplier = suppliersArray.find((s) => s.id === product.supplierId)

        return {
          ...product,
          category: category || null,
          supplier: supplier || null,
        }
      })

      console.log("📦 Productos procesados con relaciones:", productsWithRelations)

      setProducts(productsWithRelations)
      setCategories(categoriesArray)
      setSuppliers(suppliersArray)
    } catch (error) {
      console.error("❌ Error loading data:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      })
      setProducts([])
      setCategories([])
      setSuppliers([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setCurrentProduct({
      id: 0,
      name: "",
      description: "",
      price: 0,
      categoryId: 0,
      supplierId: 0,
    })
    setIsCreateOpen(true)
  }

  const handleEdit = (product: Product) => {
    console.log("✏️ Editando producto:", product)
    setCurrentProduct({ ...product })
    setIsEditOpen(true)
  }

  const handleDelete = (product: Product) => {
    setCurrentProduct(product)
    setIsDeleteOpen(true)
  }

  const saveProduct = async () => {
    if (
      !currentProduct.name.trim() ||
      !currentProduct.description.trim() ||
      currentProduct.price <= 0 ||
      !currentProduct.categoryId ||
      !currentProduct.supplierId
    ) {
      toast({
        title: "Error",
        description: "Todos los campos son requeridos y el precio debe ser mayor a 0",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const productData = {
        name: currentProduct.name.trim(),
        description: currentProduct.description.trim(),
        price: currentProduct.price,
        categoryId: currentProduct.categoryId,
        supplierId: currentProduct.supplierId,
      }

      console.log("💾 Guardando producto con datos:", productData)

      if (isCreateOpen) {
        const result = await productsService.create(productData)
        console.log("✅ Producto creado:", result)
        toast({
          title: "Éxito",
          description: "Producto creado correctamente",
        })
        setIsCreateOpen(false)
      } else if (isEditOpen) {
        const result = await productsService.update(currentProduct.id, productData)
        console.log("✅ Producto actualizado:", result)
        toast({
          title: "Éxito",
          description: "Producto actualizado correctamente",
        })
        setIsEditOpen(false)
      }

      await loadData()
    } catch (error) {
      console.error("❌ Error saving product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el producto",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    try {
      setSaving(true)
      await productsService.delete(currentProduct.id)
      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
      })
      setIsDeleteOpen(false)
      await loadData()
    } catch (error) {
      console.error("❌ Error deleting product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el producto",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  console.log("🔍 Estado actual de productos:")
  console.log("- Loading:", loading)
  console.log("- Products:", products)
  console.log("- Categories:", categories)
  console.log("- Suppliers:", suppliers)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando productos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-slate-500 mt-1">Gestiona tu inventario de productos</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Productos</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>Total: {filteredProducts.length} productos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                    {products.length === 0 ? (
                      <div>
                        <p>No hay productos disponibles</p>
                        <p className="text-xs mt-1">Crea tu primer producto usando el botón "Nuevo Producto"</p>
                      </div>
                    ) : (
                      "No se encontraron productos que coincidan con la búsqueda"
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.category?.name}</TableCell>
                    <TableCell>{product.supplier?.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Producto</DialogTitle>
            <DialogDescription>Completa los campos para agregar un nuevo producto al inventario.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="nombre">Nombre del Producto</label>
              <Input
                id="nombre"
                value={currentProduct.name}
                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                disabled={saving}
                placeholder="Ingresa el nombre del producto"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="descripcion">Descripción</label>
              <Textarea
                id="descripcion"
                value={currentProduct.description}
                onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                disabled={saving}
                rows={3}
                placeholder="Ingresa la descripción del producto"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="precio">Precio</label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                value={currentProduct.price}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, price: Number.parseFloat(e.target.value) || 0 })
                }
                disabled={saving}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="categoria">Categoría</label>
              <Select
                value={currentProduct.categoryId > 0 ? currentProduct.categoryId.toString() : ""}
                onValueChange={(value) => setCurrentProduct({ ...currentProduct, categoryId: Number.parseInt(value) })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="proveedor">Proveedor</label>
              <Select
                value={currentProduct.supplierId > 0 ? currentProduct.supplierId.toString() : ""}
                onValueChange={(value) => setCurrentProduct({ ...currentProduct, supplierId: Number.parseInt(value) })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button
              onClick={saveProduct}
              disabled={
                saving ||
                !currentProduct.name.trim() ||
                !currentProduct.description.trim() ||
                currentProduct.price <= 0 ||
                !currentProduct.categoryId ||
                !currentProduct.supplierId
              }
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>Modifica los campos para actualizar la información del producto.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="nombre">Nombre del Producto</label>
              <Input
                id="nombre"
                value={currentProduct.name}
                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                disabled={saving}
                placeholder="Ingresa el nombre del producto"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="descripcion">Descripción</label>
              <Textarea
                id="descripcion"
                value={currentProduct.description}
                onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                disabled={saving}
                rows={3}
                placeholder="Ingresa la descripción del producto"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="precio">Precio</label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                value={currentProduct.price}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, price: Number.parseFloat(e.target.value) || 0 })
                }
                disabled={saving}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="categoria">Categoría</label>
              <Select
                value={currentProduct.categoryId > 0 ? currentProduct.categoryId.toString() : ""}
                onValueChange={(value) => setCurrentProduct({ ...currentProduct, categoryId: Number.parseInt(value) })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="proveedor">Proveedor</label>
              <Select
                value={currentProduct.supplierId > 0 ? currentProduct.supplierId.toString() : ""}
                onValueChange={(value) => setCurrentProduct({ ...currentProduct, supplierId: Number.parseInt(value) })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button
              onClick={saveProduct}
              disabled={
                saving ||
                !currentProduct.name.trim() ||
                !currentProduct.description.trim() ||
                currentProduct.price <= 0 ||
                !currentProduct.categoryId ||
                !currentProduct.supplierId
              }
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Producto</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{currentProduct.name}</p>
            <p className="text-slate-500">ID: {currentProduct.id}</p>
            <p className="text-slate-500">Precio: ${currentProduct.price?.toFixed(2)}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
