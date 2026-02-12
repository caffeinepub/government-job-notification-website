import { useState } from 'react';
import { useClientAdminAuth } from '../hooks/useClientAdminAuth';
import { useSimpleJobs } from '../hooks/useSimpleJobs';
import { useOfficialLinks } from '../hooks/useOfficialLinks';
import { useHomeCards } from '../hooks/useHomeCards';
import { usePreparationResources } from '../hooks/usePreparationResources';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Trash2, LogOut, Lock, Plus, Edit2, Save, X, Key } from 'lucide-react';

const GEMINI_API_KEY_STORAGE_KEY = 'gemini_api_key';

function PasswordPrompt({ onLogin }: { onLogin: (password: string) => boolean }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password"
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminPanel() {
  const { logout } = useClientAdminAuth();
  const { jobs, add: addJob, remove: removeJob } = useSimpleJobs();
  const { links, update: updateLink } = useOfficialLinks();
  const { items: homeCardItems, add: addHomeCard, remove: removeHomeCard } = useHomeCards();
  const {
    books,
    testSeries,
    addBook,
    updateBook,
    deleteBook,
    addTestSeries,
    updateTestSeries,
    deleteTestSeries,
  } = usePreparationResources();

  // Gemini API Key state
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) || '';
  });
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // Job form state
  const [jobTitle, setJobTitle] = useState('');
  const [jobCategory, setJobCategory] = useState<'Rajasthan' | 'India'>('Rajasthan');
  const [jobLastDate, setJobLastDate] = useState('');
  const [jobNotificationLink, setJobNotificationLink] = useState('');

  // Official links edit state
  const [editingLinks, setEditingLinks] = useState<Record<string, string>>({});

  // Home card form state
  const [showHomeCardForm, setShowHomeCardForm] = useState(false);
  const [homeCardTitle, setHomeCardTitle] = useState('');
  const [homeCardLastDate, setHomeCardLastDate] = useState('');
  const [homeCardCategory, setHomeCardCategory] = useState<'latestJobs' | 'admitCards' | 'results'>('latestJobs');

  // Books management state
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookUrl, setBookUrl] = useState('');
  const [bookUrlError, setBookUrlError] = useState('');
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editBookData, setEditBookData] = useState<{ title: string; description: string; url: string }>({
    title: '',
    description: '',
    url: '',
  });
  const [editBookUrlError, setEditBookUrlError] = useState('');

  // Test Series management state
  const [showAddTestSeriesForm, setShowAddTestSeriesForm] = useState(false);
  const [testSeriesTitle, setTestSeriesTitle] = useState('');
  const [testSeriesDescription, setTestSeriesDescription] = useState('');
  const [testSeriesUrl, setTestSeriesUrl] = useState('');
  const [testSeriesUrlError, setTestSeriesUrlError] = useState('');
  const [editingTestSeriesId, setEditingTestSeriesId] = useState<string | null>(null);
  const [editTestSeriesData, setEditTestSeriesData] = useState<{ title: string; description: string; url: string }>({
    title: '',
    description: '',
    url: '',
  });
  const [editTestSeriesUrlError, setEditTestSeriesUrlError] = useState('');

  const handleSaveApiKey = () => {
    if (geminiApiKey.trim()) {
      localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, geminiApiKey.trim());
      setApiKeySaved(true);
      setTimeout(() => setApiKeySaved(false), 2000);
    }
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobLastDate.trim() || !jobNotificationLink.trim()) {
      alert('Please fill in all fields');
      return;
    }

    addJob({
      title: jobTitle,
      category: jobCategory,
      lastDate: jobLastDate,
      notificationLink: jobNotificationLink,
    });

    // Reset form
    setJobTitle('');
    setJobCategory('Rajasthan');
    setJobLastDate('');
    setJobNotificationLink('');
  };

  const handleDeleteJob = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      removeJob(id);
    }
  };

  const handleUpdateLink = (id: string) => {
    const newUrl = editingLinks[id];
    if (newUrl && newUrl.trim()) {
      updateLink(id, { url: newUrl.trim() });
      const updatedEditing = { ...editingLinks };
      delete updatedEditing[id];
      setEditingLinks(updatedEditing);
    }
  };

  const handleAddHomeCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeCardTitle.trim() || !homeCardLastDate.trim()) {
      alert('Please fill in all fields');
      return;
    }

    addHomeCard({
      title: homeCardTitle,
      lastDate: homeCardLastDate,
      category: homeCardCategory,
    });

    // Reset form
    setHomeCardTitle('');
    setHomeCardLastDate('');
    setHomeCardCategory('latestJobs');
    setShowHomeCardForm(false);
  };

  const handleDeleteHomeCard = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      removeHomeCard(id);
    }
  };

  // URL validation helper
  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Books handlers
  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBookUrlError('');

    if (!bookTitle.trim() || !bookDescription.trim() || !bookUrl.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (!isValidUrl(bookUrl)) {
      setBookUrlError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    addBook({
      title: bookTitle.trim(),
      description: bookDescription.trim(),
      url: bookUrl.trim(),
    });

    // Reset form
    setBookTitle('');
    setBookDescription('');
    setBookUrl('');
    setShowAddBookForm(false);
  };

  const handleEditBook = (id: string) => {
    const book = books.find((b) => b.id === id);
    if (book) {
      setEditingBookId(id);
      setEditBookData({
        title: book.title,
        description: book.description,
        url: book.url,
      });
      setEditBookUrlError('');
    }
  };

  const handleSaveBook = (id: string) => {
    setEditBookUrlError('');

    if (!editBookData.title.trim() || !editBookData.description.trim() || !editBookData.url.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (!isValidUrl(editBookData.url)) {
      setEditBookUrlError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    updateBook(id, {
      title: editBookData.title.trim(),
      description: editBookData.description.trim(),
      url: editBookData.url.trim(),
    });

    setEditingBookId(null);
  };

  const handleCancelEditBook = () => {
    setEditingBookId(null);
    setEditBookUrlError('');
  };

  const handleDeleteBook = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteBook(id);
    }
  };

  // Test Series handlers
  const handleAddTestSeries = (e: React.FormEvent) => {
    e.preventDefault();
    setTestSeriesUrlError('');

    if (!testSeriesTitle.trim() || !testSeriesDescription.trim() || !testSeriesUrl.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (!isValidUrl(testSeriesUrl)) {
      setTestSeriesUrlError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    addTestSeries({
      title: testSeriesTitle.trim(),
      description: testSeriesDescription.trim(),
      url: testSeriesUrl.trim(),
    });

    // Reset form
    setTestSeriesTitle('');
    setTestSeriesDescription('');
    setTestSeriesUrl('');
    setShowAddTestSeriesForm(false);
  };

  const handleEditTestSeries = (id: string) => {
    const series = testSeries.find((s) => s.id === id);
    if (series) {
      setEditingTestSeriesId(id);
      setEditTestSeriesData({
        title: series.title,
        description: series.description,
        url: series.url,
      });
      setEditTestSeriesUrlError('');
    }
  };

  const handleSaveTestSeries = (id: string) => {
    setEditTestSeriesUrlError('');

    if (!editTestSeriesData.title.trim() || !editTestSeriesData.description.trim() || !editTestSeriesData.url.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (!isValidUrl(editTestSeriesData.url)) {
      setEditTestSeriesUrlError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    updateTestSeries(id, {
      title: editTestSeriesData.title.trim(),
      description: editTestSeriesData.description.trim(),
      url: editTestSeriesData.url.trim(),
    });

    setEditingTestSeriesId(null);
  };

  const handleCancelEditTestSeries = () => {
    setEditingTestSeriesId(null);
    setEditTestSeriesUrlError('');
  };

  const handleDeleteTestSeries = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteTestSeries(id);
    }
  };

  // Group home cards by category
  const latestJobsCards = homeCardItems.filter(item => item.category === 'latestJobs');
  const admitCardsCards = homeCardItems.filter(item => item.category === 'admitCards');
  const resultsCards = homeCardItems.filter(item => item.category === 'results');

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button onClick={logout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Gemini API Key Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            AI Chat Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="geminiApiKey">Gemini API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="geminiApiKey"
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="flex-1"
                />
                <Button onClick={handleSaveApiKey} disabled={!geminiApiKey.trim()}>
                  {apiKeySaved ? 'Saved!' : 'Save'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get your API key from{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Job */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddJob} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., RPSC RAS Recruitment 2026"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobCategory">Category</Label>
                <Select value={jobCategory} onValueChange={(value) => setJobCategory(value as 'Rajasthan' | 'India')}>
                  <SelectTrigger id="jobCategory">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobLastDate">Last Date</Label>
                <Input
                  id="jobLastDate"
                  type="date"
                  value={jobLastDate}
                  onChange={(e) => setJobLastDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobNotificationLink">Notification Link</Label>
                <Input
                  id="jobNotificationLink"
                  type="url"
                  value={jobNotificationLink}
                  onChange={(e) => setJobNotificationLink(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
            <Button type="submit">Add Job</Button>
          </form>
        </CardContent>
      </Card>

      {/* Manage Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Jobs ({jobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No jobs added yet. Use the form above to add your first job.
            </p>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 border border-border rounded-sm hover:bg-accent/50"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                      <span className="bg-secondary px-2 py-0.5 rounded">{job.category}</span>
                      <span>Last Date: {job.lastDate}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteJob(job.id, job.title)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manage Homepage Cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manage Homepage Cards ({homeCardItems.length})</CardTitle>
            <Button onClick={() => setShowHomeCardForm(!showHomeCardForm)} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showHomeCardForm && (
            <form onSubmit={handleAddHomeCard} className="p-4 border border-border rounded-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeCardTitle">Title</Label>
                  <Input
                    id="homeCardTitle"
                    value={homeCardTitle}
                    onChange={(e) => setHomeCardTitle(e.target.value)}
                    placeholder="e.g., RPSC RAS 2026"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeCardLastDate">Last Date</Label>
                  <Input
                    id="homeCardLastDate"
                    value={homeCardLastDate}
                    onChange={(e) => setHomeCardLastDate(e.target.value)}
                    placeholder="e.g., 30 Feb"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeCardCategory">Category</Label>
                  <Select value={homeCardCategory} onValueChange={(value) => setHomeCardCategory(value as any)}>
                    <SelectTrigger id="homeCardCategory">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latestJobs">Latest Jobs</SelectItem>
                      <SelectItem value="admitCards">Admit Cards</SelectItem>
                      <SelectItem value="results">Results</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add Card</Button>
                <Button type="button" variant="outline" onClick={() => setShowHomeCardForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Latest Jobs Cards */}
          {latestJobsCards.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Latest Jobs ({latestJobsCards.length})</h3>
              {latestJobsCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-3 border border-border rounded-sm hover:bg-accent/50"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{card.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Last Date: {card.lastDate}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteHomeCard(card.id, card.title)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Admit Cards */}
          {admitCardsCards.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Admit Cards ({admitCardsCards.length})</h3>
              {admitCardsCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-3 border border-border rounded-sm hover:bg-accent/50"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{card.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Last Date: {card.lastDate}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteHomeCard(card.id, card.title)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {resultsCards.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Results ({resultsCards.length})</h3>
              {resultsCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-3 border border-border rounded-sm hover:bg-accent/50"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{card.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Last Date: {card.lastDate}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteHomeCard(card.id, card.title)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manage Official Links */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Official Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-3 p-3 border border-border rounded-sm hover:bg-accent/50"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{link.label}</h3>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>
                {editingLinks[link.id] !== undefined ? (
                  <div className="flex gap-2 items-center">
                    <Input
                      type="url"
                      value={editingLinks[link.id]}
                      onChange={(e) =>
                        setEditingLinks({ ...editingLinks, [link.id]: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-64"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleUpdateLink(link.id)}
                      disabled={!editingLinks[link.id]?.trim()}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const updated = { ...editingLinks };
                        delete updated[link.id];
                        setEditingLinks(updated);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingLinks({ ...editingLinks, [link.id]: link.url })}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manage Books */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manage Books ({books.length})</CardTitle>
            <Button onClick={() => setShowAddBookForm(!showAddBookForm)} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddBookForm && (
            <form onSubmit={handleAddBook} className="p-4 border border-border rounded-sm space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bookTitle">Book Title</Label>
                <Input
                  id="bookTitle"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="e.g., NCERT Class 12 History"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookDescription">Description</Label>
                <Input
                  id="bookDescription"
                  value={bookDescription}
                  onChange={(e) => setBookDescription(e.target.value)}
                  placeholder="e.g., Complete NCERT textbook for Class 12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookUrl">URL</Label>
                <Input
                  id="bookUrl"
                  type="url"
                  value={bookUrl}
                  onChange={(e) => setBookUrl(e.target.value)}
                  placeholder="https://..."
                />
                {bookUrlError && (
                  <p className="text-sm text-destructive">{bookUrlError}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add Book</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddBookForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {books.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No books added yet.
            </p>
          ) : (
            <div className="space-y-2">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="p-3 border border-border rounded-sm hover:bg-accent/50"
                >
                  {editingBookId === book.id ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={editBookData.title}
                          onChange={(e) =>
                            setEditBookData({ ...editBookData, title: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={editBookData.description}
                          onChange={(e) =>
                            setEditBookData({ ...editBookData, description: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                          type="url"
                          value={editBookData.url}
                          onChange={(e) =>
                            setEditBookData({ ...editBookData, url: e.target.value })
                          }
                        />
                        {editBookUrlError && (
                          <p className="text-sm text-destructive">{editBookUrlError}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveBook(book.id)}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEditBook}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{book.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{book.description}</p>
                        <p className="text-xs text-muted-foreground truncate mt-1">{book.url}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditBook(book.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteBook(book.id, book.title)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manage Test Series */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manage Test Series ({testSeries.length})</CardTitle>
            <Button onClick={() => setShowAddTestSeriesForm(!showAddTestSeriesForm)} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Test Series
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddTestSeriesForm && (
            <form onSubmit={handleAddTestSeries} className="p-4 border border-border rounded-sm space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testSeriesTitle">Test Series Title</Label>
                <Input
                  id="testSeriesTitle"
                  value={testSeriesTitle}
                  onChange={(e) => setTestSeriesTitle(e.target.value)}
                  placeholder="e.g., RPSC RAS Mock Tests"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testSeriesDescription">Description</Label>
                <Input
                  id="testSeriesDescription"
                  value={testSeriesDescription}
                  onChange={(e) => setTestSeriesDescription(e.target.value)}
                  placeholder="e.g., Complete mock test series for RAS exam"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testSeriesUrl">URL</Label>
                <Input
                  id="testSeriesUrl"
                  type="url"
                  value={testSeriesUrl}
                  onChange={(e) => setTestSeriesUrl(e.target.value)}
                  placeholder="https://..."
                />
                {testSeriesUrlError && (
                  <p className="text-sm text-destructive">{testSeriesUrlError}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add Test Series</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddTestSeriesForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {testSeries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No test series added yet.
            </p>
          ) : (
            <div className="space-y-2">
              {testSeries.map((series) => (
                <div
                  key={series.id}
                  className="p-3 border border-border rounded-sm hover:bg-accent/50"
                >
                  {editingTestSeriesId === series.id ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={editTestSeriesData.title}
                          onChange={(e) =>
                            setEditTestSeriesData({ ...editTestSeriesData, title: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={editTestSeriesData.description}
                          onChange={(e) =>
                            setEditTestSeriesData({ ...editTestSeriesData, description: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                          type="url"
                          value={editTestSeriesData.url}
                          onChange={(e) =>
                            setEditTestSeriesData({ ...editTestSeriesData, url: e.target.value })
                          }
                        />
                        {editTestSeriesUrlError && (
                          <p className="text-sm text-destructive">{editTestSeriesUrlError}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveTestSeries(series.id)}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEditTestSeries}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{series.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{series.description}</p>
                        <p className="text-xs text-muted-foreground truncate mt-1">{series.url}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditTestSeries(series.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTestSeries(series.id, series.title)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ClientAdminPage() {
  const { isUnlocked, login } = useClientAdminAuth();

  if (!isUnlocked) {
    return <PasswordPrompt onLogin={login} />;
  }

  return <AdminPanel />;
}
