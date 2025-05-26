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
import { ordersService, productsService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: number
  productId: number
  quantity: number
  totalPrice: number
  product?: {
    id: number
    name: string
    description: string
    price: number
    categoryId?: number
    supplierId?: number
  }
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  categoryId?: number
  supplierId?: number
}

export default function OrdenesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order>({
    id: 0,
    productId: 0,
    quantity: 1,
    totalPrice: 0,
  })
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const filteredOrders = orders.filter((order) => {
    if (!order) return false
    const productName = order.product?.name || ""
    const orderId = order.id?.toString() || ""
    return productName.toLowerCase().includes(searchTerm.toLowerCase()) || orderId.includes(searchTerm)
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (currentOrder.productId && currentOrder.quantity > 0) {
      const selectedProduct = products.find((p) => p.id === currentOrder.productId)
      if (selectedProduct) {
        const totalPrice = selectedProduct.price * currentOrder.quantity
        setCurrentOrder((prev) => ({ ...prev, totalPrice }))
      }
    }
  }, [currentOrder.productId, currentOrder.quantity, products])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log("🔄 Cargando órdenes y productos...")

      const productsData = await productsService.getAll()
      console.log("📦 Productos cargados:", productsData)

      const productsArray = Array.isArray(productsData) ? productsData : []
      setProducts(productsArray)

      const ordersData = await ordersService.getAll()
      console.log("📋 Órdenes cargadas (raw):", ordersData)

      const ordersArray = Array.isArray(ordersData) ? ordersData : []

      const ordersWithProducts = ordersArray.map((order) => {
        if (!order.product && order.productId) {
          const product = productsArray.find((p) => p.id === order.productId)
          return {
            ...order,
            product: product || null,
          }
        }
        return order
      })

      console.log("📋 Órdenes procesadas:", ordersWithProducts)
      setOrders(ordersWithProducts)

      if (ordersWithProducts.length === 0) {
        console.log("⚠️ No se encontraron órdenes")
      } else {
        console.log(`✅ ${ordersWithProducts.length} órdenes cargadas correctamente`)
      }
    } catch (error) {
      console.error("❌ Error loading data:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      })
      setOrders([])
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setCurrentOrder({
      id: 0,
      productId: 0,
      quantity: 1,
      totalPrice: 0,
    })
    setIsCreateOpen(true)
  }

  const handleEdit = (order: Order) => {
    console.log("✏️ Editando orden:", order)
    setCurrentOrder({
      id: order.id,
      productId: order.productId,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      product: order.product,
    })
    setIsEditOpen(true)
  }

  const handleDelete = (order: Order) => {
    setCurrentOrder(order)
    setIsDeleteOpen(true)
  }

  const handleView = (order: Order) => {
    setCurrentOrder(order)
    setIsViewOpen(true)
  }

  const saveOrder = async () => {
    if (!currentOrder.productId || currentOrder.quantity <= 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar un producto y la cantidad debe ser mayor a 0",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      const selectedProduct = products.find((p) => p.id === currentOrder.productId)
      if (!selectedProduct) {
        toast({
          title: "Error",
          description: "Producto no encontrado",
          variant: "destructive",
        })
        return
      }

      const orderData = {
        productId: currentOrder.productId,
        quantity: currentOrder.quantity,
        totalPrice: selectedProduct.price * currentOrder.quantity,
      }

      console.log("💾 Guardando orden con datos:", orderData)

      if (isCreateOpen) {
        const result = await ordersService.create(orderData)
        console.log("✅ Orden creada:", result)
        toast({
          title: "Éxito",
          description: "Orden creada correctamente",
        })
        setIsCreateOpen(false)
      } else if (isEditOpen) {
        const result = await ordersService.update(currentOrder.id, orderData)
        console.log("✅ Orden actualizada:", result)
        toast({
          title: "Éxito",
          description: "Orden actualizada correctamente",
        })
        setIsEditOpen(false)
      }

      await loadData()
    } catch (error) {
      console.error("❌ Error saving order:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la orden",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    try {
      setSaving(true)
      await ordersService.delete(currentOrder.id)
      toast({
        title: "Éxito",
        description: "Orden eliminada correctamente",
      })
      setIsDeleteOpen(false)
      await loadData()
    } catch (error) {
      console.error("❌ Error deleting order:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar la orden",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getSelectedProduct = () => {
    return products.find((p) => p.id === currentOrder.productId)
  }

  console.log("🔍 Estado actual:")
  console.log("- Loading:", loading)
  console.log("- Orders:", orders)
  console.log("- Products:", products)
  console.log("- Filtered orders:", filteredOrders)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando órdenes...</span>
      </div>
    )
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
          <CardDescription>Total: {filteredOrders.length} órdenes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Precio Unitario</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                    {orders.length === 0 ? (
                      <div>
                        <p>No hay órdenes disponibles</p>
                        <p className="text-xs mt-1">Crea tu primera orden usando el botón "Nueva Orden"</p>
                      </div>
                    ) : (
                      "No se encontraron órdenes que coincidan con la búsqueda"
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell className="font-medium">
                      {order.product?.name || `Producto ID: ${order.productId}`}
                    </TableCell>
                    <TableCell>${order.product?.price?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell className="font-bold">${order.totalPrice?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleView(order)}>
                          <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(order)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(order)}>
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

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles de la Orden</DialogTitle>
            <DialogDescription>Información detallada de la orden seleccionada.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">ID de Orden</p>
                <p className="font-medium">{currentOrder.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Producto</p>
                <p className="font-medium">{currentOrder.product?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Descripción</p>
                <p>{currentOrder.product?.description || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Precio Unitario</p>
                <p>${currentOrder.product?.price?.toFixed(2) || "0.00"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Cantidad</p>
                <p className="font-medium">{currentOrder.quantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total</p>
                <p className="text-xl font-bold text-green-600">${currentOrder.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Orden</DialogTitle>
            <DialogDescription>Completa los campos para agregar una nueva orden.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="producto">Producto</label>
              <Select
                value={currentOrder.productId > 0 ? currentOrder.productId.toString() : ""}
                onValueChange={(value) => setCurrentOrder({ ...currentOrder, productId: Number.parseInt(value) })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} - ${product.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {getSelectedProduct() && (
              <div className="bg-slate-50 p-3 rounded-md">
                <p className="text-sm font-medium">Producto seleccionado:</p>
                <p className="font-medium">{getSelectedProduct()?.name}</p>
                <p className="text-sm text-slate-600">{getSelectedProduct()?.description}</p>
                <p className="text-lg font-bold text-green-600">Precio: ${getSelectedProduct()?.price.toFixed(2)}</p>
              </div>
            )}

            <div className="grid gap-2">
              <label htmlFor="cantidad">Cantidad</label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                value={currentOrder.quantity}
                onChange={(e) => setCurrentOrder({ ...currentOrder, quantity: Number.parseInt(e.target.value) || 1 })}
                disabled={saving}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="total">Total</label>
              <Input
                id="total"
                value={`$${currentOrder.totalPrice.toFixed(2)}`}
                disabled
                className="font-bold text-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={saveOrder} disabled={saving || !currentOrder.productId}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Orden</DialogTitle>
            <DialogDescription>Modifica los campos para actualizar la información de la orden.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="producto">Producto</label>
              <Select
                value={currentOrder.productId > 0 ? currentOrder.productId.toString() : ""}
                onValueChange={(value) => setCurrentOrder({ ...currentOrder, productId: Number.parseInt(value) })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} - ${product.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {getSelectedProduct() && (
              <div className="bg-slate-50 p-3 rounded-md">
                <p className="text-sm font-medium">Producto seleccionado:</p>
                <p className="font-medium">{getSelectedProduct()?.name}</p>
                <p className="text-sm text-slate-600">{getSelectedProduct()?.description}</p>
                <p className="text-lg font-bold text-green-600">Precio: ${getSelectedProduct()?.price.toFixed(2)}</p>
              </div>
            )}

            <div className="grid gap-2">
              <label htmlFor="cantidad">Cantidad</label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                value={currentOrder.quantity}
                onChange={(e) => setCurrentOrder({ ...currentOrder, quantity: Number.parseInt(e.target.value) || 1 })}
                disabled={saving}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="total">Total</label>
              <Input
                id="total"
                value={`$${currentOrder.totalPrice.toFixed(2)}`}
                disabled
                className="font-bold text-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={saveOrder} disabled={saving || !currentOrder.productId}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Orden</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">Orden #{currentOrder.id}</p>
            <p className="text-slate-500">Producto: {currentOrder.product?.name || "N/A"}</p>
            <p className="text-slate-500">Total: ${currentOrder.totalPrice?.toFixed(2) || "0.00"}</p>
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
