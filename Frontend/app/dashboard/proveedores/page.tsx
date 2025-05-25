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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Plus, Search, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

// Datos de ejemplo
const initialProveedores = [
  {
    id: 1,
    nombre: "HP Inc.",
    contacto: "Carlos Rodríguez",
    telefono: "555-1234",
    email: "carlos@hp.com",
    direccion: "Av. Tecnológica 123, Ciudad de México",
  },
  {
    id: 2,
    nombre: "Dell Technologies",
    contacto: "Ana Martínez",
    telefono: "555-5678",
    email: "ana@dell.com",
    direccion: "Calle Innovación 456, Guadalajara",
  },
  {
    id: 3,
    nombre: "Logitech",
    contacto: "Roberto Sánchez",
    telefono: "555-9012",
    email: "roberto@logitech.com",
    direccion: "Blvd. Periférico 789, Monterrey",
  },
  {
    id: 4,
    nombre: "Western Digital",
    contacto: "Laura Gómez",
    telefono: "555-3456",
    email: "laura@wd.com",
    direccion: "Av. Digital 321, Querétaro",
  },
  {
    id: 5,
    nombre: "Cisco Systems",
    contacto: "Miguel Torres",
    telefono: "555-7890",
    email: "miguel@cisco.com",
    direccion: "Calle Redes 654, Puebla",
  },
]

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState(initialProveedores)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentProveedor, setCurrentProveedor] = useState({
    id: 0,
    nombre: "",
    contacto: "",
    telefono: "",
    email: "",
    direccion: "",
  })

  const filteredProveedores = proveedores.filter(
    (proveedor) =>
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreate = () => {
    setCurrentProveedor({
      id: proveedores.length + 1,
      nombre: "",
      contacto: "",
      telefono: "",
      email: "",
      direccion: "",
    })
    setIsCreateOpen(true)
  }

  const handleEdit = (proveedor: any) => {
    setCurrentProveedor(proveedor)
    setIsEditOpen(true)
  }

  const handleDelete = (proveedor: any) => {
    setCurrentProveedor(proveedor)
    setIsDeleteOpen(true)
  }

  const saveProveedor = () => {
    if (isCreateOpen) {
      setProveedores([...proveedores, currentProveedor])
      setIsCreateOpen(false)
    } else if (isEditOpen) {
      setProveedores(proveedores.map((p) => (p.id === currentProveedor.id ? currentProveedor : p)))
      setIsEditOpen(false)
    }
  }

  const confirmDelete = () => {
    setProveedores(proveedores.filter((p) => p.id !== currentProveedor.id))
    setIsDeleteOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-slate-500 mt-1">Gestiona tus proveedores</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Proveedores</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Buscar proveedores..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>Total: {filteredProveedores.length} proveedores</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Dirección</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProveedores.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell>{proveedor.id}</TableCell>
                  <TableCell className="font-medium">{proveedor.nombre}</TableCell>
                  <TableCell>{proveedor.contacto}</TableCell>
                  <TableCell>{proveedor.telefono}</TableCell>
                  <TableCell>{proveedor.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{proveedor.direccion}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(proveedor)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(proveedor)}>
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

      {/* Modal de Crear Proveedor */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
            <DialogDescription>Completa los campos para agregar un nuevo proveedor.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="nombre">Nombre del Proveedor</label>
              <Input
                id="nombre"
                value={currentProveedor.nombre}
                onChange={(e) => setCurrentProveedor({ ...currentProveedor, nombre: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="contacto">Persona de Contacto</label>
              <Input
                id="contacto"
                value={currentProveedor.contacto}
                onChange={(e) => setCurrentProveedor({ ...currentProveedor, contacto: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="telefono">Teléfono</label>
                <Input
                  id="telefono"
                  value={currentProveedor.telefono}
                  onChange={(e) => setCurrentProveedor({ ...currentProveedor, telefono: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={currentProveedor.email}
                  onChange={(e) => setCurrentProveedor({ ...currentProveedor, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="direccion">Dirección</label>
              <Textarea
                id="direccion"
                value={currentProveedor.direccion}
                onChange={(e) => setCurrentProveedor({ ...currentProveedor, direccion: e.target.value })}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveProveedor}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Editar Proveedor */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
            <DialogDescription>Modifica los campos para actualizar la información del proveedor.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="nombre">Nombre del Proveedor</label>
              <Input
                id="nombre"
                value={currentProveedor.nombre}
                onChange={(e) => setCurrentProveedor({ ...currentProveedor, nombre: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="contacto">Persona de Contacto</label>
              <Input
                id="contacto"
                value={currentProveedor.contacto}
                onChange={(e) => setCurrentProveedor({ ...currentProveedor, contacto: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="telefono">Teléfono</label>
                <Input
                  id="telefono"
                  value={currentProveedor.telefono}
                  onChange={(e) => setCurrentProveedor({ ...currentProveedor, telefono: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={currentProveedor.email}
                  onChange={(e) => setCurrentProveedor({ ...currentProveedor, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="direccion">Dirección</label>
              <Textarea
                id="direccion"
                value={currentProveedor.direccion}
                onChange={(e) => setCurrentProveedor({ ...currentProveedor, direccion: e.target.value })}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveProveedor}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Eliminar Proveedor */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Proveedor</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{currentProveedor.nombre}</p>
            <p className="text-slate-500">ID: {currentProveedor.id}</p>
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
