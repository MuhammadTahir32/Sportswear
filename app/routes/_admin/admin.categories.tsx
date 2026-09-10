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
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Categories</h2>
          <p className="text-[13px] text-[#9A9A9A]">
            Manage your product categories and hierarchy.
          </p>
        </div>
        <Button
          className="bg-[#C6FF3D] hover:bg-[#b0e633] text-[#0D0D0D] text-[13px] font-bold px-4 py-2 rounded-[8px] h-auto flex items-center"
          onClick={() => setShowAdd(!showAdd)}
        >
          <Plus size={16} className="mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] p-5 md:p-6 mb-6">
          <h3 className="text-[14px] font-semibold text-white mb-5">New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
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
              className="bg-[#1A1A1A] border-white/5 text-white focus:border-[#C6FF3D]/50"
            />
            <Input
              label="Slug *"
              value={addForm.slug}
              onChange={(e) => setAddForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="flat-laces"
              className="bg-[#1A1A1A] border-white/5 text-white focus:border-[#C6FF3D]/50"
            />
            <div>
              <label className="text-[12px] font-semibold text-white block mb-2">Parent</label>
              <select
                value={addForm.parent_id}
                onChange={(e) => setAddForm((p) => ({ ...p, parent_id: e.target.value }))}
                className="w-full h-[40px] px-4 border border-white/5 rounded-[8px] text-[13px] text-white bg-[#1A1A1A] focus:outline-none focus:border-[#C6FF3D]/50 appearance-none"
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
          <div className="flex gap-3">
            <Button
              className="bg-[#C6FF3D] hover:bg-[#b0e633] text-[#0D0D0D] text-[13px] font-bold px-5 h-[40px] rounded-[8px]"
              onClick={handleAdd}
              disabled={createCategory.isPending}
            >
              {createCategory.isPending ? 'Creating…' : 'Create Category'}
            </Button>
            <Button
              className="bg-transparent border border-white/10 text-white hover:bg-white/5 text-[13px] font-bold px-5 h-[40px] rounded-[8px]"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Category list */}
      <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#9A9A9A]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center">
            <FolderTree size={48} className="text-white/10 mb-4" />
            <h3 className="text-[16px] font-bold text-white mb-1">No categories found</h3>
            <p className="text-[13px] text-[#9A9A9A]">
              Get started by creating your first category.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {topLevel.map((cat) => {
              const children = getChildren(cat.id)
              const isEditing = editId === cat.id

              return (
                <div key={cat.id}>
                  {/* Parent category row */}
                  <div className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors group">
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-3">
                        <input
                          value={editForm.name}
                          onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                          className="h-[36px] px-3 bg-[#1A1A1A] border border-[#C6FF3D]/50 text-white rounded-[6px] text-[13px] focus:outline-none w-48"
                          autoFocus
                        />
                        <input
                          value={editForm.slug}
                          onChange={(e) => setEditForm((p) => ({ ...p, slug: e.target.value }))}
                          className="h-[36px] px-3 bg-[#1A1A1A] border border-white/5 text-white rounded-[6px] text-[13px] focus:outline-none w-48"
                        />
                        <button
                          onClick={handleUpdate}
                          className="p-1.5 text-[#C6FF3D] hover:bg-[#C6FF3D]/10 rounded-[6px] transition-colors"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="p-1.5 text-[#9A9A9A] hover:bg-white/10 hover:text-white rounded-[6px] transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <span className="text-[14px] font-semibold text-white">{cat.name}</span>
                          <span className="text-[12px] text-[#9A9A9A] ml-2">/{cat.slug}</span>
                          {children.length > 0 && (
                            <span className="text-[10px] text-[#0D0D0D] font-bold ml-3 bg-[#C6FF3D] px-2 py-0.5 rounded-[4px]">
                              {children.length} sub
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(cat)}
                            className="p-2 text-[#9A9A9A] hover:text-[#C6FF3D] hover:bg-white/10 rounded-[6px] transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          {deleteId === cat.id ? (
                            <div className="flex items-center gap-2 mr-2">
                              <button
                                onClick={() => handleDelete(cat.id)}
                                className="text-[11px] text-red-500 font-semibold hover:text-red-400"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteId(null)}
                                className="text-[11px] text-[#9A9A9A] font-semibold hover:text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteId(cat.id)}
                              className="p-2 text-[#9A9A9A] hover:text-red-500 hover:bg-red-500/10 rounded-[6px] transition-colors"
                            >
                              <Trash2 size={16} />
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
                        className="flex items-center justify-between px-5 py-3 pl-12 bg-white/[0.02] border-t border-white/[0.02] hover:bg-white/5 transition-colors group/child"
                      >
                        {isEditingChild ? (
                          <div className="flex-1 flex items-center gap-3">
                            <input
                              value={editForm.name}
                              onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                              className="h-[32px] px-3 bg-[#1A1A1A] border border-[#C6FF3D]/50 text-white rounded-[6px] text-[12px] focus:outline-none w-40"
                              autoFocus
                            />
                            <input
                              value={editForm.slug}
                              onChange={(e) => setEditForm((p) => ({ ...p, slug: e.target.value }))}
                              className="h-[32px] px-3 bg-[#1A1A1A] border border-white/5 text-white rounded-[6px] text-[12px] focus:outline-none w-40"
                            />
                            <button
                              onClick={handleUpdate}
                              className="p-1.5 text-[#C6FF3D] hover:bg-[#C6FF3D]/10 rounded-[6px] transition-colors"
                            >
                              <Save size={14} />
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="p-1.5 text-[#9A9A9A] hover:bg-white/10 hover:text-white rounded-[6px] transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center">
                              <span className="text-[13px] text-[#9A9A9A]">↳</span>
                              <span className="text-[13px] font-medium text-white ml-2">
                                {child.name}
                              </span>
                              <span className="text-[11px] text-[#9A9A9A] ml-2">/{child.slug}</span>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover/child:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEdit(child)}
                                className="p-1.5 text-[#9A9A9A] hover:text-[#C6FF3D] hover:bg-white/10 rounded-[6px] transition-colors"
                              >
                                <Edit size={14} />
                              </button>
                              {deleteId === child.id ? (
                                <div className="flex items-center gap-2 mr-2">
                                  <button
                                    onClick={() => handleDelete(child.id)}
                                    className="text-[11px] text-red-500 font-semibold hover:text-red-400"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setDeleteId(null)}
                                    className="text-[11px] text-[#9A9A9A] font-semibold hover:text-white"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteId(child.id)}
                                  className="p-1.5 text-[#9A9A9A] hover:text-red-500 hover:bg-red-500/10 rounded-[6px] transition-colors"
                                >
                                  <Trash2 size={14} />
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
