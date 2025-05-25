"use client"

import { useState } from "react"
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
import { Pencil, Plus, Search, Trash2 } from "lucide-react"

// Datos de ejemplo
const initialProducts = [
  { id: 1, nombre: "Laptop HP Pavilion", precio: 899.99, stock: 15, categoria: "Electrónicos", proveedor: "HP Inc." },
  {
    id: 2,
    nombre: 'Monitor Dell 27"',
    precio: 299.99,
    stock: 23,
    categoria: "Periféricos",
    proveedor: "Dell Technologies",
  },
  {
    id: 3,
    nombre: "Teclado Mecánico Logitech",
    precio: 129.99,
    stock: 42,
    categoria: "Periféricos",
    proveedor: "Logitech",
  },
  { id: 4, nombre: "Mouse Inalámbrico", precio: 49.99, stock: 67, categoria: "Periféricos", proveedor: "Logitech" },
  {
    id: 5,
    nombre: "Disco Duro Externo 1TB",
    precio: 89.99,
    stock: 31,
    categoria: "Almacenamiento",
    proveedor: "Western Digital",
  },
]

const categorias = ["Electrónicos", "Periféricos", "Almacenamiento", "Redes", "Software"]

const proveedores = ["HP Inc.", "Dell Technologies", "Logitech", "Western Digital", "Cisco Systems"]

export default function ProductosPage() {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState({
    id: 0,
    nombre: "",
    precio: 0,
    stock: 0,
    categoria: "",
    proveedor: "",
  })

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.proveedor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreate = () => {
    setCurrentProduct({
      id: products.length + 1,
      nombre: "",
      precio: 0,
      stock: 0,
      categoria: "",
      proveedor: "",
    })
    setIsCreateOpen(true)
  }

  const handleEdit = (product: any) => {
    setCurrentProduct(product)
    setIsEditOpen(true)
  }

  const handleDelete = (product: any) => {
    setCurrentProduct(product)
    setIsDeleteOpen(true)
  }

  const saveProduct = () => {
    if (isCreateOpen) {
      setProducts([...products, currentProduct])
      setIsCreateOpen(false)
    } else if (isEditOpen) {
      setProducts(products.map((p) => (p.id === currentProduct.id ? currentProduct : p)))
      setIsEditOpen(false)
    }
  }

  const confirmDelete = () => {
    setProducts(products.filter((p) => p.id !== currentProduct.id))
    setIsDeleteOpen(false)
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
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell className="font-medium">{product.nombre}</TableCell>
                  <TableCell>${product.precio.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.categoria}</TableCell>
                  <TableCell>{product.proveedor}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Crear Producto */}
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
                value={currentProduct.nombre}
                onChange={(e) => setCurrentProduct({ ...currentProduct, nombre: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="precio">Precio</label>
                <Input
                  id="precio"
                  type="number"
                  value={currentProduct.precio}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, precio: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="stock">Stock</label>
                <Input
                  id="stock"
                  type="number"
                  value={currentProduct.stock}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="categoria">Categoría</label>
              <Select
                value={currentProduct.categoria}
                onValueChange={(value) => setCurrentProduct({ ...currentProduct, categoria: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="proveedor">Proveedor</label>
              <Select
                value={currentProduct.proveedor}
                onValueChange={(value) => setCurrentProduct({ ...currentProduct, proveedor: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {proveedores.map((prov) => (
                    <SelectItem key={prov} value={prov}>
                      {prov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveProduct}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Editar Producto */}
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
                value={currentProduct.nombre}
                onChange={(e) => setCurrentProduct({ ...currentProduct, nombre: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="precio">Precio</label>
                <Input
                  id="precio"
                  type="number"
                  value={currentProduct.precio}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, precio: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="stock">Stock</label>
                <Input
                  id="stock"
                  type="number"
                  value={currentProduct.stock}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="categoria">Categoría</label>
              <Select
                value={currentProduct.categoria}
                onValueChange={(value) => setCurrentProduct({ ...currentProduct, categoria: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="proveedor">Proveedor</label>
              <Select
                value={currentProduct.proveedor}
                onValueChange={(value) => setCurrentProduct({ ...currentProduct, proveedor: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {proveedores.map((prov) => (
                    <SelectItem key={prov} value={prov}>
                      {prov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveProduct}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Eliminar Producto */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Producto</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{currentProduct.nombre}</p>
            <p className="text-slate-500">ID: {currentProduct.id}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
