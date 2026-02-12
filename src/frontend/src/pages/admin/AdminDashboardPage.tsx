import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import PhotoUploadFabTool from '../../components/admin/PhotoUploadFabTool';
import ManageDailyQuizPanel from '../../components/admin/ManageDailyQuizPanel';
import AdminSettingsDialog from '../../components/admin/AdminSettingsDialog';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useOfficialLinks } from '../../hooks/useOfficialLinks';
import { useStudyCorner } from '../../hooks/useStudyCorner';
import { useClientAdminAuth } from '../../hooks/useClientAdminAuth';
import { Plus, Pencil, Trash2, ExternalLink, FileText, BookOpen, Briefcase, ArrowUp, ArrowDown, Brain, Lock, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { links, add: addLink, update: updateLink, remove: removeLink } = useOfficialLinks();
  const { categories, addCategory, updateCategory, removeCategory, addItem, updateItem, removeItem } = useStudyCorner();
  const { logout } = useClientAdminAuth();

  // Settings Dialog State
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Official Links State
  const [newLinkDialog, setNewLinkDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [linkForm, setLinkForm] = useState({ label: '', url: '' });

  // Study Corner State
  const [newCategoryDialog, setNewCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [newItemDialog, setNewItemDialog] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ categoryId: string; itemId: string } | null>(null);
  const [itemForm, setItemForm] = useState({ title: '', url: '', type: 'link' as 'link' | 'pdf' });

  // Official Links Handlers
  const handleAddLink = () => {
    if (!linkForm.label.trim() || !linkForm.url.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!linkForm.url.startsWith('http://') && !linkForm.url.startsWith('https://')) {
      toast.error('URL must start with http:// or https://');
      return;
    }
    addLink({ label: linkForm.label.trim(), url: linkForm.url.trim() });
    setLinkForm({ label: '', url: '' });
    setNewLinkDialog(false);
    toast.success('Link added successfully');
  };

  const handleUpdateLink = (id: string) => {
    if (!linkForm.label.trim() || !linkForm.url.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!linkForm.url.startsWith('http://') && !linkForm.url.startsWith('https://')) {
      toast.error('URL must start with http:// or https://');
      return;
    }
    updateLink(id, { label: linkForm.label.trim(), url: linkForm.url.trim() });
    setEditingLink(null);
    setLinkForm({ label: '', url: '' });
    toast.success('Link updated successfully');
  };

  const handleDeleteLink = (id: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      removeLink(id);
      toast.success('Link deleted successfully');
    }
  };

  // Study Corner Handlers
  const handleAddCategory = () => {
    if (!categoryForm.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    addCategory({ 
      name: categoryForm.name.trim(), 
      description: categoryForm.description.trim() || '',
      items: []
    });
    setCategoryForm({ name: '', description: '' });
    setNewCategoryDialog(false);
    toast.success('Category added successfully');
  };

  const handleUpdateCategory = (id: string) => {
    if (!categoryForm.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    updateCategory(id, { 
      name: categoryForm.name.trim(),
      description: categoryForm.description.trim() || ''
    });
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '' });
    toast.success('Category updated successfully');
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category and all its items?')) {
      removeCategory(id);
      toast.success('Category deleted successfully');
    }
  };

  const handleAddItem = (categoryId: string) => {
    if (!itemForm.title.trim() || !itemForm.url.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!itemForm.url.startsWith('http://') && !itemForm.url.startsWith('https://') && !itemForm.url.startsWith('#')) {
      toast.error('URL must start with http://, https://, or #');
      return;
    }
    addItem(categoryId, { 
      title: itemForm.title.trim(), 
      url: itemForm.url.trim(),
      type: itemForm.type
    });
    setItemForm({ title: '', url: '', type: 'link' });
    setNewItemDialog(null);
    toast.success('Item added successfully');
  };

  const handleUpdateItem = (categoryId: string, itemId: string) => {
    if (!itemForm.title.trim() || !itemForm.url.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!itemForm.url.startsWith('http://') && !itemForm.url.startsWith('https://') && !itemForm.url.startsWith('#')) {
      toast.error('URL must start with http://, https://, or #');
      return;
    }
    updateItem(categoryId, itemId, { 
      title: itemForm.title.trim(), 
      url: itemForm.url.trim(),
      type: itemForm.type
    });
    setEditingItem(null);
    setItemForm({ title: '', url: '', type: 'link' });
    toast.success('Item updated successfully');
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      removeItem(categoryId, itemId);
      toast.success('Item deleted successfully');
    }
  };

  const moveItemInCategory = (categoryId: string, itemIndex: number, direction: 'up' | 'down') => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    if (newIndex < 0 || newIndex >= category.items.length) return;

    const newItems = [...category.items];
    const [movedItem] = newItems.splice(itemIndex, 1);
    newItems.splice(newIndex, 0, movedItem);

    updateCategory(categoryId, { items: newItems });
  };

  const handleLockAdmin = () => {
    if (confirm('Are you sure you want to lock the admin panel? You will need to enter the password again.')) {
      logout();
      toast.success('Admin panel locked');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage job posts, daily quiz, official links, and study materials
          </p>
        </div>
        <Button variant="outline" onClick={handleLockAdmin} className="gap-2">
          <Lock className="w-4 h-4" />
          Lock Panel
        </Button>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="flex flex-wrap gap-[15px] h-auto bg-transparent p-0 md:flex-row">
          <TabsTrigger 
            value="jobs" 
            className="flex-1 min-w-[140px] gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-blue-100 dark:bg-blue-950 hover:bg-blue-200 dark:hover:bg-blue-900"
          >
            <Briefcase className="w-4 h-4" />
            <span>Job Posts</span>
          </TabsTrigger>
          <TabsTrigger 
            value="quiz" 
            className="flex-1 min-w-[140px] gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-green-100 dark:bg-green-950 hover:bg-green-200 dark:hover:bg-green-900"
          >
            <Brain className="w-4 h-4" />
            <span>📢 Manage Quiz</span>
          </TabsTrigger>
          <TabsTrigger 
            value="links" 
            className="flex-1 min-w-[140px] gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-purple-100 dark:bg-purple-950 hover:bg-purple-200 dark:hover:bg-purple-900"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Official Links</span>
          </TabsTrigger>
          <TabsTrigger 
            value="study" 
            className="flex-1 min-w-[140px] gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-orange-100 dark:bg-orange-950 hover:bg-orange-200 dark:hover:bg-orange-900"
          >
            <BookOpen className="w-4 h-4" />
            <span>Study Material</span>
          </TabsTrigger>
          <Button
            variant="outline"
            onClick={() => setSettingsOpen(true)}
            className="flex-1 min-w-[140px] gap-2 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700"
          >
            <Settings className="w-4 h-4" />
            <span>⚙️ Settings</span>
          </Button>
        </TabsList>

        {/* Job Posts Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Job Posts Management
              </CardTitle>
              <CardDescription>
                Create, edit, and manage job posts from the backend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link to="/admin/posts">
                  <Button className="w-full" size="lg">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Go to Job Posts Manager
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground text-center">
                  Manage all job posts including Latest Jobs, Admit Cards, Results, and Closed Posts
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Quiz Tab */}
        <TabsContent value="quiz" className="space-y-4">
          <ManageDailyQuizPanel />
        </TabsContent>

        {/* Official Links Tab */}
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Official Links
                  </CardTitle>
                  <CardDescription>Manage quick access links in the sidebar</CardDescription>
                </div>
                <Dialog open={newLinkDialog} onOpenChange={setNewLinkDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Official Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="new-link-label">Link Label</Label>
                        <Input
                          id="new-link-label"
                          value={linkForm.label}
                          onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                          placeholder="e.g., RPSC Official"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-link-url">URL</Label>
                        <Input
                          id="new-link-url"
                          value={linkForm.url}
                          onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewLinkDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddLink}>Add Link</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {links.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No official links yet. Add your first link above.
                  </p>
                ) : (
                  links.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{link.label}</p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:underline flex items-center gap-1"
                        >
                          {link.url}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog
                          open={editingLink === link.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setEditingLink(link.id);
                              setLinkForm({ label: link.label, url: link.url });
                            } else {
                              setEditingLink(null);
                              setLinkForm({ label: '', url: '' });
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Official Link</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label htmlFor="edit-link-label">Link Label</Label>
                                <Input
                                  id="edit-link-label"
                                  value={linkForm.label}
                                  onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-link-url">URL</Label>
                                <Input
                                  id="edit-link-url"
                                  value={linkForm.url}
                                  onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingLink(null)}>
                                Cancel
                              </Button>
                              <Button onClick={() => handleUpdateLink(link.id)}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLink(link.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Material Tab */}
        <TabsContent value="study" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Study Material Categories
                  </CardTitle>
                  <CardDescription>Manage study corner categories and items</CardDescription>
                </div>
                <Dialog open={newCategoryDialog} onOpenChange={setNewCategoryDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="new-category-name">Category Name</Label>
                        <Input
                          id="new-category-name"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          placeholder="e.g., Geography"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-category-description">Description (Optional)</Label>
                        <Textarea
                          id="new-category-description"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          placeholder="Brief description of this category"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewCategoryDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddCategory}>Add Category</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No categories yet. Add your first category above.
                  </p>
                ) : (
                  categories.map((category) => (
                    <Card key={category.id} className="border-2">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                            {category.description && (
                              <CardDescription className="mt-1">{category.description}</CardDescription>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Dialog
                              open={editingCategory === category.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  setEditingCategory(category.id);
                                  setCategoryForm({ 
                                    name: category.name, 
                                    description: category.description || '' 
                                  });
                                } else {
                                  setEditingCategory(null);
                                  setCategoryForm({ name: '', description: '' });
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Category</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div>
                                    <Label htmlFor="edit-category-name">Category Name</Label>
                                    <Input
                                      id="edit-category-name"
                                      value={categoryForm.name}
                                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-category-description">Description (Optional)</Label>
                                    <Textarea
                                      id="edit-category-description"
                                      value={categoryForm.description}
                                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setEditingCategory(null)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={() => handleUpdateCategory(category.id)}>Save Changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-muted-foreground">
                              Items ({category.items.length})
                            </p>
                            <Dialog
                              open={newItemDialog === category.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  setNewItemDialog(category.id);
                                  setItemForm({ title: '', url: '', type: 'link' });
                                } else {
                                  setNewItemDialog(null);
                                  setItemForm({ title: '', url: '', type: 'link' });
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Item
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Item to {category.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div>
                                    <Label htmlFor="new-item-title">Item Title</Label>
                                    <Input
                                      id="new-item-title"
                                      value={itemForm.title}
                                      onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                                      placeholder="e.g., Chapter 1 Notes"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="new-item-url">URL</Label>
                                    <Input
                                      id="new-item-url"
                                      value={itemForm.url}
                                      onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                                      placeholder="https://example.com or #anchor"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="new-item-type">Type</Label>
                                    <select
                                      id="new-item-type"
                                      value={itemForm.type}
                                      onChange={(e) => setItemForm({ ...itemForm, type: e.target.value as 'link' | 'pdf' })}
                                      className="w-full px-3 py-2 border rounded-md"
                                    >
                                      <option value="link">Link</option>
                                      <option value="pdf">PDF</option>
                                    </select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setNewItemDialog(null)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={() => handleAddItem(category.id)}>Add Item</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          {category.items.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No items yet. Add your first item above.
                            </p>
                          ) : (
                            category.items.map((item, index) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-2 border rounded hover:bg-accent/50 transition-colors"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{item.title}</p>
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
                                  >
                                    {item.url}
                                    {item.type === 'pdf' && <FileText className="w-3 h-3" />}
                                    {item.type === 'link' && <ExternalLink className="w-3 h-3" />}
                                  </a>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveItemInCategory(category.id, index, 'up')}
                                    disabled={index === 0}
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveItemInCategory(category.id, index, 'down')}
                                    disabled={index === category.items.length - 1}
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </Button>
                                  <Dialog
                                    open={editingItem?.categoryId === category.id && editingItem?.itemId === item.id}
                                    onOpenChange={(open) => {
                                      if (open) {
                                        setEditingItem({ categoryId: category.id, itemId: item.id });
                                        setItemForm({ 
                                          title: item.title, 
                                          url: item.url,
                                          type: item.type
                                        });
                                      } else {
                                        setEditingItem(null);
                                        setItemForm({ title: '', url: '', type: 'link' });
                                      }
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <Pencil className="w-3 h-3" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Edit Item</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div>
                                          <Label htmlFor="edit-item-title">Item Title</Label>
                                          <Input
                                            id="edit-item-title"
                                            value={itemForm.title}
                                            onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-item-url">URL</Label>
                                          <Input
                                            id="edit-item-url"
                                            value={itemForm.url}
                                            onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-item-type">Type</Label>
                                          <select
                                            id="edit-item-type"
                                            value={itemForm.type}
                                            onChange={(e) => setItemForm({ ...itemForm, type: e.target.value as 'link' | 'pdf' })}
                                            className="w-full px-3 py-2 border rounded-md"
                                          >
                                            <option value="link">Link</option>
                                            <option value="pdf">PDF</option>
                                          </select>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setEditingItem(null)}>
                                          Cancel
                                        </Button>
                                        <Button onClick={() => handleUpdateItem(category.id, item.id)}>
                                          Save Changes
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteItem(category.id, item.id)}
                                  >
                                    <Trash2 className="w-3 h-3 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PhotoUploadFabTool />
      <AdminSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
