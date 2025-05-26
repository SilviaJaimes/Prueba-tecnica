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
import { categoriesService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: number
  name: string
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentCategoria, setCurrentCategoria] = useState<Category>({
    id: 0,
    name: "",
  })
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const filteredCategorias = categorias.filter((categoria) =>
    categoria.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    loadCategorias()
  }, [])

  const loadCategorias = async () => {
    try {
      setLoading(true)
      const data = await categoriesService.getAll()
      setCategorias(data)
    } catch (error) {
      console.error("Error loading categories:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setCurrentCategoria({
      id: 0,
      name: "",
    })
    setIsCreateOpen(true)
  }

  const handleEdit = (categoria: Category) => {
    setCurrentCategoria({ ...categoria })
    setIsEditOpen(true)
  }

  const handleDelete = (categoria: Category) => {
    setCurrentCategoria(categoria)
    setIsDeleteOpen(true)
  }

  const saveCategoria = async () => {
    if (!currentCategoria.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es requerido",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      if (isCreateOpen) {
        await categoriesService.create({ name: currentCategoria.name.trim() })
        toast({
          title: "Éxito",
          description: "Categoría creada correctamente",
        })
        setIsCreateOpen(false)
      } else if (isEditOpen) {
        await categoriesService.update(currentCategoria.id, { name: currentCategoria.name.trim() })
        toast({
          title: "Éxito",
          description: "Categoría actualizada correctamente",
        })
        setIsEditOpen(false)
      }

      await loadCategorias()
    } catch (error) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la categoría",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    try {
      setSaving(true)
      await categoriesService.delete(currentCategoria.id)
      toast({
        title: "Éxito",
        description: "Categoría eliminada correctamente",
      })
      setIsDeleteOpen(false)
      await loadCategorias()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar la categoría",
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
      </div>
    )
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
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategorias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-slate-500">
                    No hay categorías disponibles
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategorias.map((categoria) => (
                  <TableRow key={categoria.id}>
                    <TableCell>{categoria.id}</TableCell>
                    <TableCell className="font-medium">{categoria.name}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
                value={currentCategoria.name}
                onChange={(e) => setCurrentCategoria({ ...currentCategoria, name: e.target.value })}
                disabled={saving}
                placeholder="Ingresa el nombre de la categoría"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={saveCategoria} disabled={saving || !currentCategoria.name.trim()}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                value={currentCategoria.name}
                onChange={(e) => setCurrentCategoria({ ...currentCategoria, name: e.target.value })}
                disabled={saving}
                placeholder="Ingresa el nombre de la categoría"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={saveCategoria} disabled={saving || !currentCategoria.name.trim()}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Categoría</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{currentCategoria.name}</p>
            <p className="text-slate-500">ID: {currentCategoria.id}</p>
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
