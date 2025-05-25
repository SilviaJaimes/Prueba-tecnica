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
const initialCategorias = [
  { id: 1, nombre: "Electrónicos", descripcion: "Dispositivos electrónicos como laptops, tablets y smartphones" },
  { id: 2, nombre: "Periféricos", descripcion: "Accesorios para computadoras como teclados, ratones y monitores" },
  { id: 3, nombre: "Almacenamiento", descripcion: "Dispositivos de almacenamiento como discos duros y memorias USB" },
  { id: 4, nombre: "Redes", descripcion: "Equipos de redes como routers, switches y cables" },
  { id: 5, nombre: "Software", descripcion: "Programas y aplicaciones informáticas" },
]

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState(initialCategorias)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentCategoria, setCurrentCategoria] = useState({
    id: 0,
    nombre: "",
    descripcion: "",
  })

  const filteredCategorias = categorias.filter(
    (categoria) =>
      categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreate = () => {
    setCurrentCategoria({
      id: categorias.length + 1,
      nombre: "",
      descripcion: "",
    })
    setIsCreateOpen(true)
  }

  const handleEdit = (categoria: any) => {
    setCurrentCategoria(categoria)
    setIsEditOpen(true)
  }

  const handleDelete = (categoria: any) => {
    setCurrentCategoria(categoria)
    setIsDeleteOpen(true)
  }

  const saveCategoria = () => {
    if (isCreateOpen) {
      setCategorias([...categorias, currentCategoria])
      setIsCreateOpen(false)
    } else if (isEditOpen) {
      setCategorias(categorias.map((c) => (c.id === currentCategoria.id ? currentCategoria : c)))
      setIsEditOpen(false)
    }
  }

  const confirmDelete = () => {
    setCategorias(categorias.filter((c) => c.id !== currentCategoria.id))
    setIsDeleteOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
          <p className="text-slate-500 mt-1">Administra las categorías de productos</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Categorías</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Buscar categorías..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>Total: {filteredCategorias.length} categorías</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>{categoria.id}</TableCell>
                  <TableCell className="font-medium">{categoria.nombre}</TableCell>
                  <TableCell>{categoria.descripcion}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(categoria)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(categoria)}>
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

      {/* Modal de Crear Categoría */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Categoría</DialogTitle>
            <DialogDescription>Completa los campos para agregar una nueva categoría.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="nombre">Nombre de la Categoría</label>
              <Input
                id="nombre"
                value={currentCategoria.nombre}
                onChange={(e) => setCurrentCategoria({ ...currentCategoria, nombre: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="descripcion">Descripción</label>
              <Textarea
                id="descripcion"
                value={currentCategoria.descripcion}
                onChange={(e) => setCurrentCategoria({ ...currentCategoria, descripcion: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveCategoria}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Editar Categoría */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>Modifica los campos para actualizar la información de la categoría.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="nombre">Nombre de la Categoría</label>
              <Input
                id="nombre"
                value={currentCategoria.nombre}
                onChange={(e) => setCurrentCategoria({ ...currentCategoria, nombre: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="descripcion">Descripción</label>
              <Textarea
                id="descripcion"
                value={currentCategoria.descripcion}
                onChange={(e) => setCurrentCategoria({ ...currentCategoria, descripcion: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveCategoria}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Eliminar Categoría */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Categoría</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{currentCategoria.nombre}</p>
            <p className="text-slate-500">ID: {currentCategoria.id}</p>
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
