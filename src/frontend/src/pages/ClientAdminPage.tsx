import { useState } from 'react';
import { useClientAdminAuth } from '../hooks/useClientAdminAuth';
import { useSimpleJobs } from '../hooks/useSimpleJobs';
import { useOfficialLinks } from '../hooks/useOfficialLinks';
import { useHomeCards } from '../hooks/useHomeCards';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Trash2, LogOut, Lock, Plus } from 'lucide-react';

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
                  <Select value={homeCardCategory} onValueChange={(value) => setHomeCardCategory(value as 'latestJobs' | 'admitCards' | 'results')}>
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
                <Button type="submit" size="sm">Add Card</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowHomeCardForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {homeCardItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No homepage cards yet. Click "Add Card" to create one.
            </p>
          ) : (
            <div className="space-y-4">
              {/* Latest Jobs */}
              {latestJobsCards.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Latest Jobs</h3>
                  <div className="space-y-2">
                    {latestJobsCards.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border border-border rounded-sm hover:bg-accent/50"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">Last Date: {item.lastDate}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteHomeCard(item.id, item.title)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admit Cards */}
              {admitCardsCards.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Admit Cards</h3>
                  <div className="space-y-2">
                    {admitCardsCards.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border border-border rounded-sm hover:bg-accent/50"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">Last Date: {item.lastDate}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteHomeCard(item.id, item.title)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results */}
              {resultsCards.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Results</h3>
                  <div className="space-y-2">
                    {resultsCards.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border border-border rounded-sm hover:bg-accent/50"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">Last Date: {item.lastDate}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteHomeCard(item.id, item.title)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
          <div className="space-y-3">
            {links.map((link) => (
              <div key={link.id} className="space-y-2 p-3 border border-border rounded-sm">
                <Label htmlFor={`link-${link.id}`} className="font-medium">
                  {link.label}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`link-${link.id}`}
                    type="url"
                    defaultValue={link.url}
                    onChange={(e) => setEditingLinks({ ...editingLinks, [link.id]: e.target.value })}
                    placeholder="https://..."
                  />
                  <Button
                    onClick={() => handleUpdateLink(link.id)}
                    disabled={!editingLinks[link.id] || editingLinks[link.id] === link.url}
                    size="sm"
                  >
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
