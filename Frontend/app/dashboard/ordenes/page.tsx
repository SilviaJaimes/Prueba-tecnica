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
import { Pencil, Plus, Search, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const initialOrdenes = [
  {
    id: 1,
    fecha: "2024-05-20",
    cliente: "Empresa ABC",
    tipo: "Venta",
    estado: "Completada",
    total: 1499.97,
    productos: [
      { id: 1, nombre: "Laptop HP Pavilion", precio: 899.99, cantidad: 1, subtotal: 899.99 },
      { id: 3, nombre: "Teclado Mecánico Logitech", precio: 129.99, cantidad: 2, subtotal: 259.98 },
      { id: 4, nombre: "Mouse Inalámbrico", precio: 49.99, cantidad: 2, subtotal: 99.98 },
      { id: 5, nombre: "Disco Duro Externo 1TB", precio: 89.99, cantidad: 2, subtotal: 179.98 },
    ],
  },
  {
    id: 2,
    fecha: "2024-05-18",
    cliente: "Corporación XYZ",
    tipo: "Venta",
    estado: "Pendiente",
    total: 1199.95,
    productos: [
      { id: 2, nombre: 'Monitor Dell 27"', precio: 299.99, cantidad: 3, subtotal: 899.97 },
      { id: 4, nombre: "Mouse Inalámbrico", precio: 49.99, cantidad: 6, subtotal: 299.94 },
    ],
  },
  {
    id: 3,
    fecha: "2024-05-15",
    cliente: "Distribuidora 123",
    tipo: "Compra",
    estado: "Completada",
    total: 4499.5,
    productos: [{ id: 1, nombre: "Laptop HP Pavilion", precio: 899.99, cantidad: 5, subtotal: 4499.95 }],
  },
]

const productos = [
  { id: 1, nombre: "Laptop HP Pavilion", precio: 899.99 },
  { id: 2, nombre: 'Monitor Dell 27"', precio: 299.99 },
  { id: 3, nombre: "Teclado Mecánico Logitech", precio: 129.99 },
  { id: 4, nombre: "Mouse Inalámbrico", precio: 49.99 },
  { id: 5, nombre: "Disco Duro Externo 1TB", precio: 89.99 },
]

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState(initialOrdenes)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [currentOrden, setCurrentOrden] = useState({
    id: 0,
    fecha: "",
    cliente: "",
    tipo: "Venta",
    estado: "Pendiente",
    total: 0,
    productos: [],
  })
  const [selectedProducto, setSelectedProducto] = useState("")
  const [cantidad, setCantidad] = useState(1)
  const [productoActual, setProductoActual] = useState(null)

  const filteredOrdenes = ordenes.filter(
    (orden) =>
      orden.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.estado.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    if (selectedProducto) {
      const producto = productos.find((p) => p.id === Number.parseInt(selectedProducto))
      setProductoActual(producto)
    } else {
      setProductoActual(null)
    }
  }, [selectedProducto])

  const handleCreate = () => {
    setCurrentOrden({
      id: ordenes.length + 1,
      fecha: new Date().toISOString().split("T")[0],
      cliente: "",
      tipo: "Venta",
      estado: "Pendiente",
      total: 0,
      productos: [],
    })
    setSelectedProducto("")
    setCantidad(1)
    setProductoActual(null)
    setIsCreateOpen(true)
  }

  const handleEdit = (orden) => {
    setCurrentOrden({ ...orden })
    setSelectedProducto("")
    setCantidad(1)
    setProductoActual(null)
    setIsEditOpen(true)
  }

  const handleDelete = (orden) => {
    setCurrentOrden(orden)
    setIsDeleteOpen(true)
  }

  const handleView = (orden) => {
    setCurrentOrden(orden)
    setIsViewOpen(true)
  }

  const addProductToOrden = () => {
    if (selectedProducto && cantidad > 0 && productoActual) {
      const subtotal = productoActual.precio * cantidad
      const existingProductIndex = currentOrden.productos.findIndex((p) => p.id === Number.parseInt(selectedProducto))

      const updatedProductos = [...currentOrden.productos]

      if (existingProductIndex >= 0) {
        updatedProductos[existingProductIndex] = {
          ...updatedProductos[existingProductIndex],
          cantidad: updatedProductos[existingProductIndex].cantidad + cantidad,
          subtotal: updatedProductos[existingProductIndex].subtotal + subtotal,
        }
      } else {
        updatedProductos.push({
          id: Number.parseInt(selectedProducto),
          nombre: productoActual.nombre,
          precio: productoActual.precio,
          cantidad: cantidad,
          subtotal: subtotal,
        })
      }

      const total = updatedProductos.reduce((sum, p) => sum + p.subtotal, 0)

      setCurrentOrden({
        ...currentOrden,
        productos: updatedProductos,
        total: total,
      })

      // Limpiar selección
      setSelectedProducto("")
      setCantidad(1)
      setProductoActual(null)
    }
  }

  const removeProductFromOrden = (productId) => {
    const updatedProductos = currentOrden.productos.filter((p) => p.id !== productId)
    const total = updatedProductos.reduce((sum, p) => sum + p.subtotal, 0)

    setCurrentOrden({
      ...currentOrden,
      productos: updatedProductos,
      total: total,
    })
  }

  const saveOrden = () => {
    if (isCreateOpen) {
      setOrdenes([...ordenes, currentOrden])
      setIsCreateOpen(false)
    } else if (isEditOpen) {
      setOrdenes(ordenes.map((o) => (o.id === currentOrden.id ? currentOrden : o)))
      setIsEditOpen(false)
    }
  }

  const confirmDelete = () => {
    setOrdenes(ordenes.filter((o) => o.id !== currentOrden.id))
    setIsDeleteOpen(false)
  }

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case "Completada":
        return "bg-green-100 text-green-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getTipoBadgeColor = (tipo) => {
    switch (tipo) {
      case "Venta":
        return "bg-blue-100 text-blue-800"
      case "Compra":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Órdenes</h1>
          <p className="text-slate-500 mt-1">Administra órdenes de compra y venta</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Orden
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Órdenes</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Buscar órdenes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>Total: {filteredOrdenes.length} órdenes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrdenes.map((orden) => (
                <TableRow key={orden.id}>
                  <TableCell>{orden.id}</TableCell>
                  <TableCell>{orden.fecha}</TableCell>
                  <TableCell className="font-medium">{orden.cliente}</TableCell>
                  <TableCell>
                    <Badge className={getTipoBadgeColor(orden.tipo)}>{orden.tipo}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEstadoBadgeColor(orden.estado)}>{orden.estado}</Badge>
                  </TableCell>
                  <TableCell>${orden.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(orden)}>
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(orden)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(orden)}>
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

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Orden</DialogTitle>
            <DialogDescription>Información detallada de la orden seleccionada.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">ID de Orden</p>
                <p>{currentOrden.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Fecha</p>
                <p>{currentOrden.fecha}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Cliente</p>
                <p>{currentOrden.cliente}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Tipo</p>
                <Badge className={getTipoBadgeColor(currentOrden.tipo)}>{currentOrden.tipo}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Estado</p>
                <Badge className={getEstadoBadgeColor(currentOrden.estado)}>{currentOrden.estado}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total</p>
                <p className="font-bold">${currentOrden.total?.toFixed(2)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Productos</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrden.productos?.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>{producto.nombre}</TableCell>
                      <TableCell>${producto.precio.toFixed(2)}</TableCell>
                      <TableCell>{producto.cantidad}</TableCell>
                      <TableCell>${producto.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Orden</DialogTitle>
            <DialogDescription>Completa los campos para agregar una nueva orden.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="cliente">Cliente</label>
                <Input
                  id="cliente"
                  value={currentOrden.cliente}
                  onChange={(e) => setCurrentOrden({ ...currentOrden, cliente: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="fecha">Fecha</label>
                <Input
                  id="fecha"
                  type="date"
                  value={currentOrden.fecha}
                  onChange={(e) => setCurrentOrden({ ...currentOrden, fecha: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="tipo">Tipo</label>
                <Select
                  value={currentOrden.tipo}
                  onValueChange={(value) => setCurrentOrden({ ...currentOrden, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Venta">Venta</SelectItem>
                    <SelectItem value="Compra">Compra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="estado">Estado</label>
                <Select
                  value={currentOrden.estado}
                  onValueChange={(value) => setCurrentOrden({ ...currentOrden, estado: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Completada">Completada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Agregar Productos</h3>
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-5">
                  <label htmlFor="producto" className="block mb-2 text-sm">
                    Producto
                  </label>
                  <Select value={selectedProducto} onValueChange={setSelectedProducto}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map((producto) => (
                        <SelectItem key={producto.id} value={producto.id.toString()}>
                          {producto.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <label htmlFor="precio" className="block mb-2 text-sm">
                    Precio
                  </label>
                  <Input id="precio" value={productoActual ? `$${productoActual.precio.toFixed(2)}` : ""} disabled />
                </div>
                <div className="col-span-2">
                  <label htmlFor="cantidad" className="block mb-2 text-sm">
                    Cantidad
                  </label>
                  <Input
                    id="cantidad"
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number.parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="subtotal" className="block mb-2 text-sm">
                    Subtotal
                  </label>
                  <Input
                    id="subtotal"
                    value={productoActual ? `$${(productoActual.precio * cantidad).toFixed(2)}` : ""}
                    disabled
                  />
                </div>
                <div className="col-span-1 flex items-end">
                  <Button onClick={addProductToOrden} disabled={!selectedProducto || cantidad < 1} className="w-full">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrden.productos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-slate-500">
                          No hay productos agregados
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentOrden.productos.map((producto) => (
                        <TableRow key={producto.id}>
                          <TableCell>{producto.nombre}</TableCell>
                          <TableCell>${producto.precio.toFixed(2)}</TableCell>
                          <TableCell>{producto.cantidad}</TableCell>
                          <TableCell>${producto.subtotal.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => removeProductFromOrden(producto.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end mt-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500">Total</p>
                  <p className="text-xl font-bold">${currentOrden.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveOrden} disabled={!currentOrden.cliente || currentOrden.productos.length === 0}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Orden</DialogTitle>
            <DialogDescription>Modifica los campos para actualizar la información de la orden.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="cliente">Cliente</label>
                <Input
                  id="cliente"
                  value={currentOrden.cliente}
                  onChange={(e) => setCurrentOrden({ ...currentOrden, cliente: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="fecha">Fecha</label>
                <Input
                  id="fecha"
                  type="date"
                  value={currentOrden.fecha}
                  onChange={(e) => setCurrentOrden({ ...currentOrden, fecha: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="tipo">Tipo</label>
                <Select
                  value={currentOrden.tipo}
                  onValueChange={(value) => setCurrentOrden({ ...currentOrden, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Venta">Venta</SelectItem>
                    <SelectItem value="Compra">Compra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="estado">Estado</label>
                <Select
                  value={currentOrden.estado}
                  onValueChange={(value) => setCurrentOrden({ ...currentOrden, estado: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Completada">Completada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Agregar Productos</h3>
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-5">
                  <label htmlFor="producto" className="block mb-2 text-sm">
                    Producto
                  </label>
                  <Select value={selectedProducto} onValueChange={setSelectedProducto}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map((producto) => (
                        <SelectItem key={producto.id} value={producto.id.toString()}>
                          {producto.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <label htmlFor="precio" className="block mb-2 text-sm">
                    Precio
                  </label>
                  <Input id="precio" value={productoActual ? `$${productoActual.precio.toFixed(2)}` : ""} disabled />
                </div>
                <div className="col-span-2">
                  <label htmlFor="cantidad" className="block mb-2 text-sm">
                    Cantidad
                  </label>
                  <Input
                    id="cantidad"
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number.parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="subtotal" className="block mb-2 text-sm">
                    Subtotal
                  </label>
                  <Input
                    id="subtotal"
                    value={productoActual ? `$${(productoActual.precio * cantidad).toFixed(2)}` : ""}
                    disabled
                  />
                </div>
                <div className="col-span-1 flex items-end">
                  <Button onClick={addProductToOrden} disabled={!selectedProducto || cantidad < 1} className="w-full">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrden.productos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-slate-500">
                          No hay productos agregados
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentOrden.productos.map((producto) => (
                        <TableRow key={producto.id}>
                          <TableCell>{producto.nombre}</TableCell>
                          <TableCell>${producto.precio.toFixed(2)}</TableCell>
                          <TableCell>{producto.cantidad}</TableCell>
                          <TableCell>${producto.subtotal.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => removeProductFromOrden(producto.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end mt-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500">Total</p>
                  <p className="text-xl font-bold">${currentOrden.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveOrden} disabled={!currentOrden.cliente || currentOrden.productos.length === 0}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Eliminar Orden */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Orden</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">Orden #{currentOrden.id}</p>
            <p className="text-slate-500">Cliente: {currentOrden.cliente}</p>
            <p className="text-slate-500">Total: ${currentOrden.total?.toFixed(2)}</p>
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