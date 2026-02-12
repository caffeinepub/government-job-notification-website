import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import AdminRouteGuard from '../../components/auth/AdminRouteGuard';
import PhotoUploadFabTool from '../../components/admin/PhotoUploadFabTool';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { Separator } from '../../components/ui/separator';
import { useOfficialLinks } from '../../hooks/useOfficialLinks';
import { useStudyCorner } from '../../hooks/useStudyCorner';
import { Plus, Pencil, Trash2, ExternalLink, FileText, BookOpen, Briefcase, ArrowUp, ArrowDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';

function ManageJobsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Manage Jobs
        </CardTitle>
        <CardDescription>Create, edit, and delete job posts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link to="/admin/posts">
          <Button className="w-full" variant="outline">
            View All Job Posts
          </Button>
        </Link>
        <Link to="/admin/posts/new">
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create New Job Post
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function ManageOfficialLinksPanel() {
  const { links, add, update, remove, reorder } = useOfficialLinks();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [formData, setFormData] = useState({ label: '', url: '', isHighlighted: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLink) {
      update(editingLink, formData);
      setEditingLink(null);
    } else {
      add(formData);
      setIsAddDialogOpen(false);
    }
    setFormData({ label: '', url: '', isHighlighted: false });
  };

  const handleEdit = (link: any) => {
    setEditingLink(link.id);
    setFormData({ label: link.label, url: link.url, isHighlighted: link.isHighlighted || false });
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorder(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < links.length - 1) {
      reorder(index, index + 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Manage Official Links
        </CardTitle>
        <CardDescription>Add, edit, or remove official board links</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {links.map((link, index) => (
            <div key={link.id} className="flex items-center gap-2 p-2 border rounded">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{link.label}</div>
                <div className="text-xs text-muted-foreground truncate">{link.url}</div>
                {link.isHighlighted && (
                  <div className="text-xs text-blue-600 font-medium">Highlighted</div>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === links.length - 1}
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleEdit(link)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => remove(link.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Official Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Official Link</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="highlighted"
                  checked={formData.isHighlighted}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isHighlighted: checked as boolean })
                  }
                />
                <Label htmlFor="highlighted">Highlight this link (blue emphasis)</Label>
              </div>
              <DialogFooter>
                <Button type="submit">Add Link</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingLink} onOpenChange={(open) => !open && setEditingLink(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Official Link</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-label">Label</Label>
                <Input
                  id="edit-label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-url">URL</Label>
                <Input
                  id="edit-url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-highlighted"
                  checked={formData.isHighlighted}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isHighlighted: checked as boolean })
                  }
                />
                <Label htmlFor="edit-highlighted">Highlight this link (blue emphasis)</Label>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function ManageStudyMaterialPanel() {
  const { categories, addCategory, updateCategory, removeCategory, addItem, updateItem, removeItem } = useStudyCorner();
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ categoryId: string; itemId: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [itemForm, setItemForm] = useState({ title: '', url: '', type: 'link' as 'link' | 'pdf' });

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory, categoryForm);
      setEditingCategory(null);
    } else {
      addCategory({ ...categoryForm, items: [] });
      setIsAddCategoryOpen(false);
    }
    setCategoryForm({ name: '', description: '' });
  };

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateItem(editingItem.categoryId, editingItem.itemId, itemForm);
      setEditingItem(null);
    } else {
      addItem(selectedCategory, itemForm);
      setIsAddItemOpen(false);
    }
    setItemForm({ title: '', url: '', type: 'link' });
  };

  const handleEditCategory = (cat: any) => {
    setEditingCategory(cat.id);
    setCategoryForm({ name: cat.name, description: cat.description });
  };

  const handleEditItem = (categoryId: string, item: any) => {
    setEditingItem({ categoryId, itemId: item.id });
    setItemForm({ title: item.title, url: item.url, type: item.type });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Manage Study Material
        </CardTitle>
        <CardDescription>Organize categories and study resources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          {categories.map((category) => (
            <div key={category.id} className="border rounded p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold">{category.name}</h4>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleEditCategory(category)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => removeCategory(category.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="space-y-1">
                {category.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm p-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {item.type === 'pdf' ? (
                        <FileText className="w-3 h-3 flex-shrink-0" />
                      ) : (
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      )}
                      <span className="truncate">{item.title}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleEditItem(category.id, item)}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => removeItem(category.id, item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setIsAddItemOpen(true);
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Item
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Study Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <Label htmlFor="cat-name">Category Name</Label>
                <Input
                  id="cat-name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cat-desc">Description</Label>
                <Textarea
                  id="cat-desc"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">Add Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-cat-name">Category Name</Label>
                <Input
                  id="edit-cat-name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-cat-desc">Description</Label>
                <Textarea
                  id="edit-cat-desc"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Study Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleItemSubmit} className="space-y-4">
              <div>
                <Label htmlFor="item-title">Title</Label>
                <Input
                  id="item-title"
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="item-url">URL</Label>
                <Input
                  id="item-url"
                  type="url"
                  value={itemForm.url}
                  onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="item-type">Type</Label>
                <Select
                  value={itemForm.type}
                  onValueChange={(value) => setItemForm({ ...itemForm, type: value as 'link' | 'pdf' })}
                >
                  <SelectTrigger id="item-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">Add Item</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Study Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleItemSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-item-title">Title</Label>
                <Input
                  id="edit-item-title"
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-item-url">URL</Label>
                <Input
                  id="edit-item-url"
                  type="url"
                  value={itemForm.url}
                  onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-item-type">Type</Label>
                <Select
                  value={itemForm.type}
                  onValueChange={(value) => setItemForm({ ...itemForm, type: value as 'link' | 'pdf' })}
                >
                  <SelectTrigger id="edit-item-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminRouteGuard>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ManageJobsPanel />
          <ManageOfficialLinksPanel />
          <ManageStudyMaterialPanel />
        </div>
      </div>
      <PhotoUploadFabTool />
    </AdminRouteGuard>
  );
}
