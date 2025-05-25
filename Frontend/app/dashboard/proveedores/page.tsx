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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Plus, Search, Trash2, Loader2 } from "lucide-react"
import { suppliersService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Proveedor {
  id: number
  name: string
  contact: string
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentProveedor, setCurrentProveedor] = useState<Proveedor>({
    id: 0,
    name: "",
    contact: "",
  })
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const filteredProveedores = proveedores.filter(
    (proveedor) =>
      proveedor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.contact.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    loadProveedores()
  }, [])

  const loadProveedores = async () => {
    try {
      setLoading(true)
      const data = await suppliersService.getAll()
      setProveedores(data)
    } catch (error) {
      console.error("Error loading suppliers:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los proveedores",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setCurrentProveedor({
      id: 0,
      name: "",
      contact: "",
    })
    setIsCreateOpen(true)
  }

  const handleEdit = (proveedor: Proveedor) => {
    setCurrentProveedor(proveedor)
    setIsEditOpen(true)
  }

  const handleDelete = (proveedor: Proveedor) => {
    setCurrentProveedor(proveedor)
    setIsDeleteOpen(true)
  }

  const saveProveedor = async () => {
    try {
      setSaving(true)

      if (isCreateOpen) {
        await suppliersService.create({
          name: currentProveedor.name,
          contact: currentProveedor.contact,
        })
        toast({
          title: "Éxito",
          description: "Proveedor creado correctamente",
        })
        setIsCreateOpen(false)
      } else if (isEditOpen) {
        await suppliersService.update(currentProveedor.id, {
          name: currentProveedor.name,
          contact: currentProveedor.contact,
        })
        toast({
          title: "Éxito",
          description: "Proveedor actualizado correctamente",
        })
        setIsEditOpen(false)
      }

      await loadProveedores()
    } catch (error) {
      console.error("Error saving supplier:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el proveedor",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    try {
      setSaving(true)
      await suppliersService.delete(currentProveedor.id)
      toast({
        title: "Éxito",
        description: "Proveedor eliminado correctamente",
      })
      setIsDeleteOpen(false)
      // Recargar la lista
      await loadProveedores()
    } catch (error) {
      console.error("Error deleting supplier:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el proveedor",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando proveedores...</span>
      </div>
    )
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
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProveedores.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell>{proveedor.id}</TableCell>
                  <TableCell className="font-medium">{proveedor.name}</TableCell>
                  <TableCell>{proveedor.contact}</TableCell>
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
                value={currentProveedor.name}
                onChange={(e) => setCurrentProveedor({ ...currentProveedor, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="contacto">Contacto</label>
              <Input
                id="contacto"
                value={currentProveedor.contact}
                onChange={(e) => setCurrentProveedor({ ...currentProveedor, contact: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button
              onClick={saveProveedor}
              disabled={saving || !currentProveedor.name.trim() || !currentProveedor.contact.trim()}
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
            <DialogTitle>Editar Proveedor</DialogTitle>
            <DialogDescription>Modifica los campos para actualizar la información del proveedor.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="nombre">Nombre del Proveedor</label>
              <Input
                id="nombre"
                value={currentProveedor.name}
                onChange={(e) => setCurrentProveedor({ ...currentProveedor, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="contacto">Contacto</label>
              <Input
                id="contacto"
                value={currentProveedor.contact}
                onChange={(e) => setCurrentProveedor({ ...currentProveedor, contact: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button
              onClick={saveProveedor}
              disabled={saving || !currentProveedor.name.trim() || !currentProveedor.contact.trim()}
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
            <DialogTitle>Eliminar Proveedor</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{currentProveedor.name}</p>
            <p className="text-slate-500">ID: {currentProveedor.id}</p>
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