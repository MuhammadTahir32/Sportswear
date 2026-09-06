import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, Edit, Trash2, Save, X, Loader2, FolderTree } from 'lucide-react'
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useAdminProducts'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const Route = createFileRoute('/_admin/admin/categories')({
  component: AdminCategoriesPage,
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function AdminCategoriesPage(): React.JSX.Element {
  const { data: categories = [], isLoading } = useAdminCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', slug: '', parent_id: '' })
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', slug: '', parent_id: '' })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function handleAdd() {
    if (!addForm.name || !addForm.slug) return
    await createCategory.mutateAsync({
      name: addForm.name,
      slug: addForm.slug,
      parent_id: addForm.parent_id || null,
    })
    setAddForm({ name: '', slug: '', parent_id: '' })
    setShowAdd(false)
  }

  async function handleUpdate() {
    if (!editId || !editForm.name || !editForm.slug) return
    await updateCategory.mutateAsync({
      id: editId,
      name: editForm.name,
      slug: editForm.slug,
      parent_id: editForm.parent_id || null,
    })
    setEditId(null)
  }

  async function handleDelete(id: string) {
    await deleteCategory.mutateAsync(id)
    setDeleteId(null)
  }

  function startEdit(cat: { id: string; name: string; slug: string; parent_id: string | null }) {
    setEditId(cat.id)
    setEditForm({ name: cat.name, slug: cat.slug, parent_id: cat.parent_id ?? '' })
  }

  // Separate top-level and child categories
  const topLevel = categories.filter((c) => !c.parent_id)
  const getChildren = (parentId: string) => categories.filter((c) => c.parent_id === parentId)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-[#0D0D0D]">Categories</h2>
        <Button variant="primary" size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={16} className="mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5 mb-5">
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-4">
            New Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <Input
              label="Name *"
              value={addForm.name}
              onChange={(e) =>
                setAddForm((p) => ({
                  ...p,
                  name: e.target.value,
                  slug: slugify(e.target.value),
                }))
              }
              placeholder="Flat Laces"
            />
            <Input
              label="Slug *"
              value={addForm.slug}
              onChange={(e) => setAddForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="flat-laces"
            />
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#4A4A4A] block mb-1.5">
                Parent
              </label>
              <select
                value={addForm.parent_id}
                onChange={(e) => setAddForm((p) => ({ ...p, parent_id: e.target.value }))}
                className="w-full h-[38px] px-4 border border-[#EFEFEF] rounded-[8px] text-sm text-[#0D0D0D] bg-white focus:outline-none focus:border-[#C6FF3D]"
              >
                <option value="">No Parent (Top Level)</option>
                {topLevel.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleAdd}
              disabled={createCategory.isPending}
            >
              {createCategory.isPending ? 'Creating…' : 'Create'}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Category list */}
      <div className="bg-white border border-[#E0E0E0] rounded-[12px] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#9A9A9A]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <FolderTree size={32} className="mx-auto text-[#9A9A9A] mb-3" />
            <p className="text-[14px] text-[#9A9A9A]">No categories yet</p>
          </div>
        ) : (
          <div className="divide-y divide-[#EFEFEF]">
            {topLevel.map((cat) => {
              const children = getChildren(cat.id)
              const isEditing = editId === cat.id

              return (
                <div key={cat.id}>
                  {/* Parent category row */}
                  <div className="flex items-center justify-between px-5 py-3 hover:bg-[#FAFAFA]">
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-3">
                        <input
                          value={editForm.name}
                          onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                          className="h-8 px-3 border border-[#C6FF3D] rounded-[6px] text-[13px] focus:outline-none w-40"
                          autoFocus
                        />
                        <input
                          value={editForm.slug}
                          onChange={(e) => setEditForm((p) => ({ ...p, slug: e.target.value }))}
                          className="h-8 px-3 border border-[#E0E0E0] rounded-[6px] text-[13px] focus:outline-none w-40"
                        />
                        <button
                          onClick={handleUpdate}
                          className="p-1 text-[#5A8A00] hover:bg-green-50 rounded"
                        >
                          <Save size={15} />
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="p-1 text-[#9A9A9A] hover:bg-[#F0F0F0] rounded"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="text-[14px] font-semibold text-[#0D0D0D]">
                            {cat.name}
                          </span>
                          <span className="text-[11px] text-[#9A9A9A] ml-2">/{cat.slug}</span>
                          {children.length > 0 && (
                            <span className="text-[10px] text-[#9A9A9A] ml-2 bg-[#F0F0F0] px-1.5 py-0.5 rounded-full">
                              {children.length} sub
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEdit(cat)}
                            className="p-1.5 text-[#9A9A9A] hover:text-[#C6FF3D] rounded-[6px] transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                          {deleteId === cat.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(cat.id)}
                                className="text-[11px] text-red-600 font-semibold hover:underline"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteId(null)}
                                className="text-[11px] text-[#9A9A9A] font-semibold hover:underline"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteId(cat.id)}
                              className="p-1.5 text-[#9A9A9A] hover:text-red-500 rounded-[6px] transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Child categories */}
                  {children.map((child) => {
                    const isEditingChild = editId === child.id

                    return (
                      <div
                        key={child.id}
                        className="flex items-center justify-between px-5 py-2.5 pl-12 bg-[#FAFAFA] hover:bg-[#F3F3F3]"
                      >
                        {isEditingChild ? (
                          <div className="flex-1 flex items-center gap-3">
                            <input
                              value={editForm.name}
                              onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                              className="h-7 px-3 border border-[#C6FF3D] rounded-[6px] text-[12px] focus:outline-none w-36"
                              autoFocus
                            />
                            <input
                              value={editForm.slug}
                              onChange={(e) => setEditForm((p) => ({ ...p, slug: e.target.value }))}
                              className="h-7 px-3 border border-[#E0E0E0] rounded-[6px] text-[12px] focus:outline-none w-36"
                            />
                            <button onClick={handleUpdate} className="p-1 text-[#5A8A00]">
                              <Save size={13} />
                            </button>
                            <button onClick={() => setEditId(null)} className="p-1 text-[#9A9A9A]">
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div>
                              <span className="text-[13px] text-[#4A4A4A]">↳ {child.name}</span>
                              <span className="text-[10px] text-[#9A9A9A] ml-2">/{child.slug}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => startEdit(child)}
                                className="p-1 text-[#9A9A9A] hover:text-[#C6FF3D] transition-colors"
                              >
                                <Edit size={13} />
                              </button>
                              {deleteId === child.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDelete(child.id)}
                                    className="text-[10px] text-red-600 font-semibold"
                                  >
                                    Yes
                                  </button>
                                  <button
                                    onClick={() => setDeleteId(null)}
                                    className="text-[10px] text-[#9A9A9A] font-semibold"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteId(child.id)}
                                  className="p-1 text-[#9A9A9A] hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
