import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Check, Bookmark, Edit, Trash2, ExternalLink, List } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { useApp } from '../context/AppContext';
import { Story } from '../types';
import { toast } from 'sonner@2.0.3';
import AddStoryForm from './AddStoryForm';

const StoriesPage: React.FC = () => {
  const { stories, readListItems, readLists, addToReadList, removeFromReadList, addReadList, markAsRead, deleteStory, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [showCreateListDialog, setShowCreateListDialog] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [pendingStoryId, setPendingStoryId] = useState<string>('');

  const filteredAndSortedStories = useMemo(() => {
    let filtered = stories.filter(story => {
      const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           story.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           story.ships.some(ship => ship.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSource = selectedSource === 'all' || story.source === selectedSource;
      const matchesStatus = selectedStatus === 'all' || story.status === selectedStatus;
      const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;

      return matchesSearch && matchesSource && matchesStatus && matchesCategory;
    });

    return filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author':
          aValue = a.author.name.toLowerCase();
          bValue = b.author.name.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case 'chaptersCount':
          aValue = a.chaptersCount;
          bValue = b.chaptersCount;
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [stories, searchTerm, selectedSource, selectedStatus, selectedCategory, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'discontinued': return 'bg-red-100 text-red-800';
      case 'long-time-no-update': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isStoryInReadList = (storyId: string, readListId: string) => {
    return readListItems.some(item => item.storyId === storyId && item.readListId === readListId);
  };

  const isStoryRead = (storyId: string) => {
    return isStoryInReadList(storyId, 'done-list');
  };

  const handleAddToReadList = (storyId: string, readListId: string) => {
    addToReadList(readListId, storyId);
  };

  const handleMarkAsRead = (storyId: string) => {
    markAsRead(storyId);
    toast.success('Story marked as read!');
  };

  const handleToggleBookmark = (storyId: string) => {
    const isBookmarked = isStoryInReadList(storyId, 'bookmark-list');
    
    if (isBookmarked) {
      removeFromReadList('bookmark-list', storyId);
      toast.success('Story removed from bookmarks!');
    } else {
      handleAddToReadList(storyId, 'bookmark-list');
      toast.success('Story added to bookmarks!');
    }
  };

  const handleToggleRead = (storyId: string) => {
    const isRead = isStoryRead(storyId);
    
    if (isRead) {
      removeFromReadList('done-list', storyId);
      toast.success('Story marked as unread!');
    } else {
      markAsRead(storyId);
      toast.success('Story marked as read!');
    }
  };

  const handleAddToSpecificList = (storyId: string, readListId: string, listName: string) => {
    if (isStoryInReadList(storyId, readListId)) {
      toast.info(`Story is already in "${listName}" list`);
      return;
    }
    handleAddToReadList(storyId, readListId);
    toast.success(`Story added to "${listName}" list!`);
  };

  const handleCreateNewList = () => {
    if (!newListName.trim()) {
      toast.error('Please enter a list name');
      return;
    }
    
    if (!currentUser) {
      toast.error('You must be logged in to create lists');
      return;
    }

    const newList = {
      name: newListName.trim(),
      userId: currentUser.id,
      isDefault: false,
      color: '#990000', // Use our primary maroon color
    };

    addReadList(newList);
    
    // If there's a pending story, add it to the new list
    if (pendingStoryId) {
      setTimeout(() => {
        const createdList = readLists.find(list => list.name === newListName.trim());
        if (createdList) {
          handleAddToSpecificList(pendingStoryId, createdList.id, createdList.name);
        }
      }, 100);
    }
    
    toast.success(`"${newListName}" list created successfully!`);
    setNewListName('');
    setPendingStoryId('');
    setShowCreateListDialog(false);
  };

  const handleShowCreateListDialog = (storyId: string) => {
    setPendingStoryId(storyId);
    setShowCreateListDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{fontFamily: 'var(--font-family-serif)'}}>Stories</h1>
          <p className="text-muted-foreground" style={{fontFamily: 'var(--font-family-serif)'}}>Browse and manage your story collection</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Story</DialogTitle>
            </DialogHeader>
            <AddStoryForm onSuccess={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{fontFamily: 'var(--font-family-serif)'}}>
            <Filter className="w-5 h-5" />
            Find your favorites
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by title, author, or ships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="ao3">AO3</SelectItem>
                <SelectItem value="wattpad">Wattpad</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="tumblr">Tumblr</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
                <SelectItem value="long-time-no-update">Long Time No Update</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="full-length">Full Length</SelectItem>
                <SelectItem value="one-shot">One Shot</SelectItem>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="spin-off">Spin Off</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="createdAt">Date Added</SelectItem>
                <SelectItem value="updatedAt">Last Updated</SelectItem>
                <SelectItem value="chaptersCount">Chapter Count</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stories List */}
      <div className="space-y-4">
        {filteredAndSortedStories.map((story) => (
          <Card key={story.id} className="border border-border bg-card hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-2 mb-1" style={{fontFamily: 'var(--font-family-serif)'}}>{story.title}</CardTitle>
                  <p className="text-sm text-muted-foreground" style={{fontFamily: 'var(--font-family-serif)'}}>by {story.author.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  {/* Read Status Button */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRead(story.id);
                    }}
                    className={`${isStoryRead(story.id) ? 'text-green-600 hover:text-green-700' : 'text-muted-foreground hover:text-green-600'}`}
                    title={isStoryRead(story.id) ? 'Mark as unread' : 'Mark as read'}
                  >
                    <Check className={`w-4 h-4 ${isStoryRead(story.id) ? 'fill-current' : ''}`} />
                  </Button>
                  
                  {/* Bookmark Button */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBookmark(story.id);
                    }}
                    className={`${isStoryInReadList(story.id, 'bookmark-list') ? 'text-primary hover:text-primary/80' : 'text-muted-foreground hover:text-primary'}`}
                    title={isStoryInReadList(story.id, 'bookmark-list') ? 'Remove from bookmarks' : 'Add to bookmarks'}
                  >
                    <Bookmark className={`w-4 h-4 ${isStoryInReadList(story.id, 'bookmark-list') ? 'fill-current' : ''}`} />
                  </Button>
                  
                  {/* More Options Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:bg-muted"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="min-w-48 z-50"
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRead(story.id);
                        }} 
                        style={{fontFamily: 'var(--font-family-sans)'}}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {isStoryRead(story.id) ? 'Mark as Unread' : 'Mark as Read'}
                      </DropdownMenuItem>
                      
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger style={{fontFamily: 'var(--font-family-sans)'}}>
                          <List className="w-4 h-4 mr-2" />
                          Add to List
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="min-w-48 z-50">
                          {readLists.map((list) => (
                            <DropdownMenuItem 
                              key={list.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToSpecificList(story.id, list.id, list.name);
                              }}
                              className={isStoryInReadList(story.id, list.id) ? 'bg-muted' : ''}
                              style={{fontFamily: 'var(--font-family-sans)'}}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{list.name}</span>
                                {isStoryInReadList(story.id, list.id) && (
                                  <Check className="w-3 h-3 text-primary" />
                                )}
                              </div>
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowCreateListDialog(story.id);
                            }} 
                            style={{fontFamily: 'var(--font-family-sans)'}}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create New List
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingStory(story);
                        }} 
                        style={{fontFamily: 'var(--font-family-sans)'}}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {story.link && (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(story.link, '_blank');
                          }} 
                          style={{fontFamily: 'var(--font-family-sans)'}}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Link
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this story?')) {
                            deleteStory(story.id);
                          }
                        }}
                        className="text-destructive"
                        style={{fontFamily: 'var(--font-family-sans)'}}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs" style={{fontFamily: 'var(--font-family-sans)'}}>
                  {story.source}
                </Badge>
                <Badge className={`text-xs ${getStatusColor(story.status)}`} style={{fontFamily: 'var(--font-family-sans)'}}>
                  {story.status}
                </Badge>
                <Badge variant="outline" className="text-xs" style={{fontFamily: 'var(--font-family-sans)'}}>
                  {story.category}
                </Badge>
                {isStoryRead(story.id) && (
                  <Badge className="text-xs bg-green-100 text-green-800" style={{fontFamily: 'var(--font-family-sans)'}}>
                    ✓ Read
                  </Badge>
                )}
                {isStoryInReadList(story.id, 'bookmark-list') && (
                  <Badge className="text-xs bg-primary/10 text-primary" style={{fontFamily: 'var(--font-family-sans)'}}>
                    🔖 Bookmarked
                  </Badge>
                )}
              </div>

              {story.ships.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground" style={{fontFamily: 'var(--font-family-sans)'}}>Relationships:</p>
                  <div className="flex flex-wrap gap-1">
                    {story.ships.slice(0, 3).map((ship, index) => (
                      <span key={index} className="text-xs text-primary" style={{fontFamily: 'var(--font-family-sans)'}}>
                        {ship}{index < Math.min(story.ships.length - 1, 2) && ', '}
                      </span>
                    ))}
                    {story.ships.length > 3 && (
                      <span className="text-xs text-muted-foreground" style={{fontFamily: 'var(--font-family-sans)'}}>
                        +{story.ships.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {story.type.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground" style={{fontFamily: 'var(--font-family-sans)'}}>Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {story.type.slice(0, 5).map((type, index) => (
                      <span key={index} className="text-xs text-muted-foreground" style={{fontFamily: 'var(--font-family-sans)'}}>
                        {type}{index < Math.min(story.type.length - 1, 4) && ', '}
                      </span>
                    ))}
                    {story.type.length > 5 && (
                      <span className="text-xs text-muted-foreground" style={{fontFamily: 'var(--font-family-sans)'}}>
                        +{story.type.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <p className="text-sm text-muted-foreground line-clamp-3" style={{fontFamily: 'var(--font-family-serif)'}}>
                {story.summary}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2" style={{fontFamily: 'var(--font-family-sans)'}}>
                <span>Words: ~{(story.chaptersCount * 2500).toLocaleString()}</span>
                <span>Chapters: {story.chaptersCount}</span>
                <span>Added: {new Date(story.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedStories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No stories found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedSource !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all'
              ? 'Try adjusting your search criteria or filters'
              : 'Start building your collection by adding your first story!'}
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Story
          </Button>
        </div>
      )}

      {/* Edit Story Dialog */}
      {editingStory && (
        <Dialog open={!!editingStory} onOpenChange={() => setEditingStory(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle style={{fontFamily: 'var(--font-family-serif)'}}>Edit Story</DialogTitle>
            </DialogHeader>
            <AddStoryForm 
              story={editingStory} 
              onSuccess={() => setEditingStory(null)} 
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Create New List Dialog */}
      <Dialog open={showCreateListDialog} onOpenChange={setShowCreateListDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{fontFamily: 'var(--font-family-serif)'}}>Create New Read List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="listName" style={{fontFamily: 'var(--font-family-sans)'}}>List Name</Label>
              <Input
                id="listName"
                placeholder="Enter list name..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateNewList()}
                style={{fontFamily: 'var(--font-family-sans)'}}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCreateListDialog(false);
                setNewListName('');
                setPendingStoryId('');
              }}
              style={{fontFamily: 'var(--font-family-sans)'}}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateNewList}
              disabled={!newListName.trim()}
              style={{fontFamily: 'var(--font-family-sans)'}}
            >
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoriesPage;