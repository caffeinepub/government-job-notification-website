import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useClientAdminAuth } from '../../hooks/useClientAdminAuth';
import PhotoUploadFabTool from '../../components/admin/PhotoUploadFabTool';
import ManageDailyQuizPanel from '../../components/admin/ManageDailyQuizPanel';
import AdminSettingsDialog from '../../components/admin/AdminSettingsDialog';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useOfficialLinks } from '../../hooks/useOfficialLinks';
import { useStudyCorner } from '../../hooks/useStudyCorner';
import { useSchemes } from '../../hooks/useSchemes';
import { useSchemeMutations } from '../../hooks/useSchemeMutations';
import { Plus, Pencil, Trash2, ExternalLink, FileText, BookOpen, Briefcase, ArrowUp, ArrowDown, Brain, LogOut, Settings, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { links, add: addLink, update: updateLink, remove: removeLink } = useOfficialLinks();
  const { categories, addCategory, updateCategory, removeCategory, addItem, updateItem, removeItem } = useStudyCorner();
  const { logout } = useClientAdminAuth();
  const { data: schemes, isLoading: schemesLoading } = useSchemes();
  const { addScheme, updateScheme, deleteScheme } = useSchemeMutations();

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

  // Schemes State
  const [newSchemeDialog, setNewSchemeDialog] = useState(false);
  const [editingScheme, setEditingScheme] = useState<bigint | null>(null);
  const [schemeForm, setSchemeForm] = useState({ name: '', category: 'Rajasthan', link: '' });
  const [deleteSchemeId, setDeleteSchemeId] = useState<bigint | null>(null);

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

  // Schemes Handlers
  const handleAddScheme = () => {
    if (!schemeForm.name.trim() || !schemeForm.category.trim()) {
      toast.error('Please fill in name and category');
      return;
    }
    
    const link = schemeForm.link.trim();
    if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
      toast.error('URL must start with http:// or https://');
      return;
    }

    addScheme.mutate({
      name: schemeForm.name.trim(),
      category: schemeForm.category,
      link: link || null,
    });

    setSchemeForm({ name: '', category: 'Rajasthan', link: '' });
    setNewSchemeDialog(false);
  };

  const handleUpdateScheme = () => {
    if (!editingScheme || !schemeForm.name.trim() || !schemeForm.category.trim()) {
      toast.error('Please fill in name and category');
      return;
    }

    const link = schemeForm.link.trim();
    if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
      toast.error('URL must start with http:// or https://');
      return;
    }

    updateScheme.mutate({
      id: editingScheme,
      name: schemeForm.name.trim(),
      category: schemeForm.category,
      link: link || null,
    });

    setEditingScheme(null);
    setSchemeForm({ name: '', category: 'Rajasthan', link: '' });
  };

  const handleDeleteScheme = () => {
    if (deleteSchemeId) {
      deleteScheme.mutate(deleteSchemeId);
      setDeleteSchemeId(null);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage job posts, daily quiz, schemes, official links, and study materials
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Logout
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
            className="flex-1 min-w-[140px] gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-purple-100 dark:bg-purple-950 hover:bg-purple-200 dark:hover:bg-purple-900"
          >
            <Brain className="w-4 h-4" />
            <span>Quiz</span>
          </TabsTrigger>
          <TabsTrigger 
            value="schemes" 
            className="flex-1 min-w-[140px] gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-green-100 dark:bg-green-950 hover:bg-green-200 dark:hover:bg-green-900"
          >
            <Building2 className="w-4 h-4" />
            <span>Schemes</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex-1 min-w-[140px] gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Job Posts Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Posts Management</CardTitle>
              <CardDescription>
                Create, edit, and manage job postings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Link to="/admin/posts">
                  <Button className="gap-2">
                    <Briefcase className="w-4 h-4" />
                    Manage Job Posts
                  </Button>
                </Link>
                <Link to="/admin/posts/new">
                  <Button variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create New Post
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent value="quiz" className="space-y-4">
          <ManageDailyQuizPanel />
        </TabsContent>

        {/* Schemes Tab */}
        <TabsContent value="schemes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sarkari Schemes Management</CardTitle>
                <CardDescription>
                  Add and manage government schemes (Rajasthan & India)
                </CardDescription>
              </div>
              <Button onClick={() => setNewSchemeDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Scheme
              </Button>
            </CardHeader>
            <CardContent>
              {schemesLoading ? (
                <p className="text-muted-foreground">Loading schemes...</p>
              ) : !schemes || schemes.length === 0 ? (
                <p className="text-muted-foreground">No schemes added yet.</p>
              ) : (
                <div className="space-y-2">
                  {schemes.map((scheme) => (
                    <div
                      key={scheme.id.toString()}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{scheme.name}</h4>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {scheme.category}
                          </span>
                        </div>
                        {scheme.link && (
                          <a
                            href={scheme.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {scheme.link}
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingScheme(scheme.id);
                            setSchemeForm({
                              name: scheme.name,
                              category: scheme.category,
                              link: scheme.link || '',
                            });
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteSchemeId(scheme.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Scheme Dialog */}
          <Dialog open={newSchemeDialog} onOpenChange={setNewSchemeDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Scheme</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scheme-name">Scheme Name</Label>
                  <Input
                    id="scheme-name"
                    value={schemeForm.name}
                    onChange={(e) =>
                      setSchemeForm({ ...schemeForm, name: e.target.value })
                    }
                    placeholder="e.g., Mukhyamantri Chiranjeevi Yojana"
                  />
                </div>
                <div>
                  <Label htmlFor="scheme-category">Category</Label>
                  <Select
                    value={schemeForm.category}
                    onValueChange={(value) =>
                      setSchemeForm({ ...schemeForm, category: value })
                    }
                  >
                    <SelectTrigger id="scheme-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheme-link">Link (Optional)</Label>
                  <Input
                    id="scheme-link"
                    value={schemeForm.link}
                    onChange={(e) =>
                      setSchemeForm({ ...schemeForm, link: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewSchemeDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddScheme}>Add Scheme</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Scheme Dialog */}
          <Dialog
            open={editingScheme !== null}
            onOpenChange={(open) => {
              if (!open) {
                setEditingScheme(null);
                setSchemeForm({ name: '', category: 'Rajasthan', link: '' });
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Scheme</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-scheme-name">Scheme Name</Label>
                  <Input
                    id="edit-scheme-name"
                    value={schemeForm.name}
                    onChange={(e) =>
                      setSchemeForm({ ...schemeForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-scheme-category">Category</Label>
                  <Select
                    value={schemeForm.category}
                    onValueChange={(value) =>
                      setSchemeForm({ ...schemeForm, category: value })
                    }
                  >
                    <SelectTrigger id="edit-scheme-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-scheme-link">Link (Optional)</Label>
                  <Input
                    id="edit-scheme-link"
                    value={schemeForm.link}
                    onChange={(e) =>
                      setSchemeForm({ ...schemeForm, link: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingScheme(null);
                    setSchemeForm({ name: '', category: 'Rajasthan', link: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateScheme}>Update Scheme</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Scheme Confirmation */}
          <AlertDialog
            open={deleteSchemeId !== null}
            onOpenChange={(open) => {
              if (!open) setDeleteSchemeId(null);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Scheme</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this scheme? This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteScheme}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Official Links</CardTitle>
              <CardDescription>
                Manage quick access links displayed on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setNewLinkDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Link
              </Button>

              <div className="space-y-2">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{link.label}</h4>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {link.url}
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingLink(link.id);
                          setLinkForm({ label: link.label, url: link.url });
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Study Corner</CardTitle>
              <CardDescription>
                Manage study material categories and items
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setNewCategoryDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Category
              </Button>

              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{category.name}</h4>
                        {category.description && (
                          <p className="text-sm text-muted-foreground">
                            {category.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingCategory(category.id);
                            setCategoryForm({
                              name: category.name,
                              description: category.description || '',
                            });
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewItemDialog(category.id)}
                        className="gap-2"
                      >
                        <Plus className="w-3 h-3" />
                        Add Item
                      </Button>

                      {category.items.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {item.type === 'pdf' ? (
                              <FileText className="w-4 h-4 text-red-600" />
                            ) : (
                              <ExternalLink className="w-4 h-4" />
                            )}
                            <span className="text-sm">{item.title}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => moveItemInCategory(category.id, index, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                moveItemInCategory(category.id, index, 'down')
                              }
                              disabled={index === category.items.length - 1}
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                setEditingItem({ categoryId: category.id, itemId: item.id });
                                setItemForm({
                                  title: item.title,
                                  url: item.url,
                                  type: item.type,
                                });
                              }}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleDeleteItem(category.id, item.id)}
                            >
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Configure API keys and external integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setSettingsOpen(true)} className="gap-2">
                <Settings className="w-4 h-4" />
                Manage Gemini API Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs for Official Links */}
      <Dialog open={newLinkDialog} onOpenChange={setNewLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-label">Label</Label>
              <Input
                id="link-label"
                value={linkForm.label}
                onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                placeholder="e.g., SSO Login"
              />
            </div>
            <div>
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
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

      <Dialog
        open={editingLink !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingLink(null);
            setLinkForm({ label: '', url: '' });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-link-label">Label</Label>
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
            <Button
              variant="outline"
              onClick={() => {
                setEditingLink(null);
                setLinkForm({ label: '', url: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => editingLink && handleUpdateLink(editingLink)}>
              Update Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogs for Study Corner */}
      <Dialog open={newCategoryDialog} onOpenChange={setNewCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, name: e.target.value })
                }
                placeholder="e.g., General Science"
              />
            </div>
            <div>
              <Label htmlFor="category-description">Description (Optional)</Label>
              <Textarea
                id="category-description"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, description: e.target.value })
                }
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

      <Dialog
        open={editingCategory !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCategory(null);
            setCategoryForm({ name: '', description: '' });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-category-name">Category Name</Label>
              <Input
                id="edit-category-name"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-category-description">
                Description (Optional)
              </Label>
              <Textarea
                id="edit-category-description"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => editingCategory && handleUpdateCategory(editingCategory)}
            >
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={newItemDialog !== null}
        onOpenChange={(open) => {
          if (!open) {
            setNewItemDialog(null);
            setItemForm({ title: '', url: '', type: 'link' });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="item-title">Title</Label>
              <Input
                id="item-title"
                value={itemForm.title}
                onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                placeholder="e.g., Physics Notes"
              />
            </div>
            <div>
              <Label htmlFor="item-url">URL</Label>
              <Input
                id="item-url"
                value={itemForm.url}
                onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                placeholder="https://example.com or #"
              />
            </div>
            <div>
              <Label htmlFor="item-type">Type</Label>
              <Select
                value={itemForm.type}
                onValueChange={(value: 'link' | 'pdf') =>
                  setItemForm({ ...itemForm, type: value })
                }
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNewItemDialog(null);
                setItemForm({ title: '', url: '', type: 'link' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => newItemDialog && handleAddItem(newItemDialog)}>
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingItem !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingItem(null);
            setItemForm({ title: '', url: '', type: 'link' });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-item-title">Title</Label>
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
              <Select
                value={itemForm.type}
                onValueChange={(value: 'link' | 'pdf') =>
                  setItemForm({ ...itemForm, type: value })
                }
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingItem(null);
                setItemForm({ title: '', url: '', type: 'link' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                editingItem &&
                handleUpdateItem(editingItem.categoryId, editingItem.itemId)
              }
            >
              Update Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <PhotoUploadFabTool />
    </div>
  );
}
