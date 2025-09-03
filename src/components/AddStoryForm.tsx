import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { useApp } from '../context/AppContext';
import { Story, Author } from '../types';

interface AddStoryFormProps {
  story?: Story;
  onSuccess: () => void;
}

const AddStoryForm: React.FC<AddStoryFormProps> = ({ story, onSuccess }) => {
  const { authors, addStory, updateStory, addAuthor } = useApp();
  
  const [formData, setFormData] = useState({
    title: '',
    authorId: '',
    source: 'ao3' as const,
    ships: [] as string[],
    type: [] as string[],
    category: 'one-shot' as const,
    chaptersCount: 1,
    status: 'completed' as const,
    summary: '',
    link: '',
  });

  const [newShip, setNewShip] = useState('');
  const [newType, setNewType] = useState('');
  const [newAuthorName, setNewAuthorName] = useState('');
  const [showNewAuthor, setShowNewAuthor] = useState(false);

  useEffect(() => {
    if (story) {
      setFormData({
        title: story.title,
        authorId: story.authorId,
        source: story.source,
        ships: story.ships,
        type: story.type,
        category: story.category,
        chaptersCount: story.chaptersCount,
        status: story.status,
        summary: story.summary,
        link: story.link || '',
      });
    }
  }, [story]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.authorId || !formData.summary) {
      alert('Please fill in all required fields');
      return;
    }

    const author = authors.find(a => a.id === formData.authorId);
    if (!author) return;

    const storyData = {
      ...formData,
      author,
      createdBy: 'current-user', // In real app, this would be the current user ID
    };

    if (story) {
      updateStory(story.id, storyData);
    } else {
      addStory(storyData);
    }
    
    onSuccess();
  };

  const handleAddShip = () => {
    if (newShip.trim() && !formData.ships.includes(newShip.trim())) {
      setFormData(prev => ({
        ...prev,
        ships: [...prev.ships, newShip.trim()]
      }));
      setNewShip('');
    }
  };

  const handleRemoveShip = (ship: string) => {
    setFormData(prev => ({
      ...prev,
      ships: prev.ships.filter(s => s !== ship)
    }));
  };

  const handleAddType = () => {
    if (newType.trim() && !formData.type.includes(newType.trim())) {
      setFormData(prev => ({
        ...prev,
        type: [...prev.type, newType.trim()]
      }));
      setNewType('');
    }
  };

  const handleRemoveType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      type: prev.type.filter(t => t !== type)
    }));
  };

  const handleAddNewAuthor = () => {
    if (newAuthorName.trim()) {
      const newAuthor = {
        name: newAuthorName.trim(),
        socials: [],
        createdBy: 'current-user',
      };
      
      addAuthor(newAuthor);
      
      // Find the newly added author and select it
      setTimeout(() => {
        const addedAuthor = authors.find(a => a.name === newAuthorName.trim());
        if (addedAuthor) {
          setFormData(prev => ({ ...prev, authorId: addedAuthor.id }));
        }
      }, 100);
      
      setNewAuthorName('');
      setShowNewAuthor(false);
    }
  };

  const commonShips = ['Drarry', 'Wolfstar', 'Jegulus', 'Stucky', 'Destiel', 'Sterek', 'Malec', 'Klance'];
  const commonTypes = ['Fluff', 'Angst', 'Hurt/Comfort', 'Smut', 'Gen', 'Fix-It', 'AU', 'Soulmate AU', 'Coffee Shop AU', 'College AU'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter story title"
          required
        />
      </div>

      {/* Author */}
      <div>
        <Label>Author *</Label>
        <div className="space-y-2">
          <Select 
            value={formData.authorId} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, authorId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an author" />
            </SelectTrigger>
            <SelectContent>
              {authors.map((author) => (
                <SelectItem key={author.id} value={author.id}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {!showNewAuthor ? (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowNewAuthor(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Author
            </Button>
          ) : (
            <Card>
              <CardContent className="pt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Author name"
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewAuthor())}
                  />
                  <Button type="button" size="sm" onClick={handleAddNewAuthor}>
                    Add
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowNewAuthor(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Source and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Source/Platform *</Label>
          <Select 
            value={formData.source} 
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, source: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ao3">Archive of Our Own (AO3)</SelectItem>
              <SelectItem value="wattpad">Wattpad</SelectItem>
              <SelectItem value="twitter">Twitter/X</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="tumblr">Tumblr</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Category *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-length">Full Length</SelectItem>
              <SelectItem value="one-shot">One Shot</SelectItem>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="spin-off">Spin Off</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chapters and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="chapters">Number of Chapters</Label>
          <Input
            id="chapters"
            type="number"
            min="1"
            value={formData.chaptersCount}
            onChange={(e) => setFormData(prev => ({ ...prev, chaptersCount: parseInt(e.target.value) || 1 }))}
          />
        </div>

        <div>
          <Label>Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="long-time-no-update">Long Time No Update</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ships */}
      <div>
        <Label>Ships/Pairings</Label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add a ship (e.g., Drarry, Wolfstar)"
              value={newShip}
              onChange={(e) => setNewShip(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddShip())}
            />
            <Button type="button" size="sm" onClick={handleAddShip}>
              Add
            </Button>
          </div>
          
          {formData.ships.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {formData.ships.map((ship) => (
                <Badge key={ship} variant="secondary" className="flex items-center gap-1">
                  {ship}
                  <button
                    type="button"
                    onClick={() => handleRemoveShip(ship)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Suggestions:</span>{' '}
            {commonShips.map((ship) => (
              <button
                key={ship}
                type="button"
                onClick={() => {
                  if (!formData.ships.includes(ship)) {
                    setFormData(prev => ({ ...prev, ships: [...prev.ships, ship] }));
                  }
                }}
                className="text-primary hover:underline mr-2"
              >
                {ship}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Types */}
      <div>
        <Label>Types/Tags</Label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add a type (e.g., Fluff, Angst)"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddType())}
            />
            <Button type="button" size="sm" onClick={handleAddType}>
              Add
            </Button>
          </div>
          
          {formData.type.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {formData.type.map((type) => (
                <Badge key={type} variant="outline" className="flex items-center gap-1">
                  {type}
                  <button
                    type="button"
                    onClick={() => handleRemoveType(type)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Suggestions:</span>{' '}
            {commonTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  if (!formData.type.includes(type)) {
                    setFormData(prev => ({ ...prev, type: [...prev.type, type] }));
                  }
                }}
                className="text-primary hover:underline mr-2"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Link */}
      <div>
        <Label htmlFor="link">Link (Optional)</Label>
        <Input
          id="link"
          type="url"
          value={formData.link}
          onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
          placeholder="https://..."
        />
      </div>

      {/* Summary */}
      <div>
        <Label htmlFor="summary">Summary *</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          placeholder="Describe the story..."
          rows={4}
          required
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {story ? 'Update Story' : 'Add Story'}
        </Button>
      </div>
    </form>
  );
};

export default AddStoryForm;