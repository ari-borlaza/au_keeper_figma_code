import React, { useState } from 'react';
import { Plus, Edit, Trash2, ExternalLink, Twitter, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../context/AppContext';
import { Author, AuthorSocial } from '../types';

const AuthorsPage: React.FC = () => {
  const { authors, stories, addAuthor, updateAuthor, deleteAuthor } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStoriesCount = (authorId: string) => {
    return stories.filter(story => story.authorId === authorId).length;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'ao3': return <span className="text-xs font-bold">A3</span>;
      case 'wattpad': return <span className="text-xs font-bold">W</span>;
      case 'tiktok': return <span className="text-xs font-bold">TT</span>;
      case 'tumblr': return <span className="text-xs font-bold">T</span>;
      case 'instagram': return <span className="text-xs font-bold">IG</span>;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Authors</h1>
          <p className="text-muted-foreground">Manage authors and their social media links</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Author
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Author</DialogTitle>
            </DialogHeader>
            <AuthorForm onSuccess={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthors.map((author) => (
          <Card key={author.id} className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-1">{author.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {getStoriesCount(author.id)} {getStoriesCount(author.id) === 1 ? 'story' : 'stories'}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingAuthor(author)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (getStoriesCount(author.id) > 0) {
                        alert('Cannot delete author with stories. Please remove stories first.');
                      } else {
                        deleteAuthor(author.id);
                      }
                    }}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {author.socials.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Social Media:</p>
                  <div className="flex flex-wrap gap-2">
                    {author.socials.map((social) => (
                      <Badge
                        key={social.id}
                        variant="outline"
                        className="flex items-center gap-1 cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => window.open(social.link, '_blank')}
                      >
                        {getPlatformIcon(social.platform)}
                        <span>@{social.handle}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No social media links</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAuthors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Plus className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No authors found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search' : 'Start by adding your favorite authors!'}
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Author
          </Button>
        </div>
      )}

      {/* Edit Author Dialog */}
      {editingAuthor && (
        <Dialog open={!!editingAuthor} onOpenChange={() => setEditingAuthor(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Author</DialogTitle>
            </DialogHeader>
            <AuthorForm 
              author={editingAuthor} 
              onSuccess={() => setEditingAuthor(null)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface AuthorFormProps {
  author?: Author;
  onSuccess: () => void;
}

const AuthorForm: React.FC<AuthorFormProps> = ({ author, onSuccess }) => {
  const { addAuthor, updateAuthor } = useApp();
  
  const [name, setName] = useState(author?.name || '');
  const [socials, setSocials] = useState<Omit<AuthorSocial, 'id' | 'authorId'>[]>(
    author?.socials.map(s => ({ platform: s.platform, handle: s.handle, link: s.link })) || []
  );

  const [newSocial, setNewSocial] = useState({
    platform: 'twitter' as const,
    handle: '',
    link: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter author name');
      return;
    }

    const authorData = {
      name: name.trim(),
      socials: socials.map((social, index) => ({
        id: `social-${Date.now()}-${index}`,
        authorId: author?.id || '',
        ...social,
      })),
      createdBy: 'current-user',
    };

    if (author) {
      updateAuthor(author.id, authorData);
    } else {
      addAuthor(authorData);
    }
    
    onSuccess();
  };

  const handleAddSocial = () => {
    if (newSocial.handle.trim()) {
      let link = newSocial.link.trim();
      
      // Auto-generate link if not provided
      if (!link) {
        switch (newSocial.platform) {
          case 'twitter':
            link = `https://twitter.com/${newSocial.handle.replace('@', '')}`;
            break;
          case 'ao3':
            link = `https://archiveofourown.org/users/${newSocial.handle.replace('@', '')}`;
            break;
          case 'wattpad':
            link = `https://www.wattpad.com/user/${newSocial.handle.replace('@', '')}`;
            break;
          case 'tumblr':
            link = `https://${newSocial.handle.replace('@', '')}.tumblr.com`;
            break;
          case 'instagram':
            link = `https://instagram.com/${newSocial.handle.replace('@', '')}`;
            break;
          case 'tiktok':
            link = `https://tiktok.com/@${newSocial.handle.replace('@', '')}`;
            break;
          default:
            link = newSocial.handle;
        }
      }

      setSocials(prev => [...prev, {
        platform: newSocial.platform,
        handle: newSocial.handle.trim(),
        link: link,
      }]);
      
      setNewSocial({ platform: 'twitter' as const, handle: '', link: '' });
    }
  };

  const handleRemoveSocial = (index: number) => {
    setSocials(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Author Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter author name"
          required
        />
      </div>

      <div>
        <Label>Social Media Links</Label>
        
        {/* Existing socials */}
        {socials.length > 0 && (
          <div className="space-y-2 mb-4">
            {socials.map((social, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border border-border rounded-md">
                <Badge variant="outline" className="min-w-fit">
                  {social.platform}
                </Badge>
                <span className="text-sm">@{social.handle}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSocial(index)}
                  className="ml-auto text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add new social */}
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Select 
                  value={newSocial.platform} 
                  onValueChange={(value: any) => setNewSocial(prev => ({ ...prev, platform: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="ao3">AO3</SelectItem>
                    <SelectItem value="wattpad">Wattpad</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="tumblr">Tumblr</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="@username"
                  value={newSocial.handle}
                  onChange={(e) => setNewSocial(prev => ({ ...prev, handle: e.target.value }))}
                />
                
                <Input
                  placeholder="URL (optional)"
                  value={newSocial.link}
                  onChange={(e) => setNewSocial(prev => ({ ...prev, link: e.target.value }))}
                />
              </div>
              
              <Button type="button" size="sm" onClick={handleAddSocial}>
                <Plus className="w-4 h-4 mr-2" />
                Add Social Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {author ? 'Update Author' : 'Add Author'}
        </Button>
      </div>
    </form>
  );
};

export default AuthorsPage;