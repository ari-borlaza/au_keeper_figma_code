import React, { useState } from 'react';
import { Plus, BookMarked, Edit, Trash2, MoreHorizontal, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useApp } from '../context/AppContext';
import { ReadList } from '../types';

const ReadListsPage: React.FC = () => {
  const { readLists, readListItems, stories, addReadList, updateReadList, deleteReadList, removeFromReadList, markAsRead } = useApp();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingList, setEditingList] = useState<ReadList | null>(null);
  const [selectedList, setSelectedList] = useState<string>('done-list');

  const getListItems = (listId: string) => {
    return readListItems.filter(item => item.readListId === listId);
  };

  const handleDeleteList = (listId: string) => {
    const list = readLists.find(l => l.id === listId);
    if (list?.isDefault) {
      alert('Cannot delete default lists');
      return;
    }
    
    const itemCount = getListItems(listId).length;
    if (itemCount > 0 && !confirm(`This list contains ${itemCount} stories. Are you sure you want to delete it?`)) {
      return;
    }
    
    deleteReadList(listId);
    if (selectedList === listId) {
      setSelectedList('done-list');
    }
  };

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

  const selectedListData = readLists.find(l => l.id === selectedList);
  const selectedListItems = getListItems(selectedList);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Read Lists</h1>
          <p className="text-muted-foreground">Organize your stories into custom collections</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Read List</DialogTitle>
            </DialogHeader>
            <ReadListForm onSuccess={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lists Sidebar */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Your Lists</h3>
          <div className="space-y-2">
            {readLists.map((list) => {
              const itemCount = getListItems(list.id).length;
              return (
                <Card
                  key={list.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedList === list.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedList(list.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: list.color || '#d4a574' }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{list.name}</p>
                          <p className="text-xs text-muted-foreground">{itemCount} stories</p>
                        </div>
                      </div>
                      
                      {!list.isDefault && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingList(list)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteList(list.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* List Contents */}
        <div className="lg:col-span-3">
          {selectedListData ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: selectedListData.color || '#d4a574' }}
                    />
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookMarked className="w-5 h-5" />
                        {selectedListData.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedListItems.length} {selectedListItems.length === 1 ? 'story' : 'stories'}
                      </p>
                    </div>
                  </div>
                  
                  {!selectedListData.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingList(selectedListData)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit List
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {selectedListItems.length > 0 ? (
                  <div className="space-y-4">
                    {selectedListItems.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground line-clamp-1">{item.story.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">by {item.story.author.name}</p>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.story.source}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(item.story.status)}`}>
                              {item.story.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.story.category}
                            </Badge>
                          </div>

                          {item.story.ships.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {item.story.ships.slice(0, 3).map((ship, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {ship}
                                </Badge>
                              ))}
                              {item.story.ships.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{item.story.ships.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.story.summary}
                          </p>

                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>{item.story.chaptersCount} chapters</span>
                            <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {selectedList === 'pending-list' && (
                            <Button
                              size="sm"
                              onClick={() => markAsRead(item.storyId)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Mark Read
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log('Move to list')}>
                                <BookMarked className="w-4 h-4 mr-2" />
                                Move to List
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => removeFromReadList(selectedList, item.storyId)}
                                className="text-destructive"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <BookMarked className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No stories in this list</h3>
                    <p className="text-muted-foreground">
                      Add stories from the Stories page to populate this list!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <BookMarked className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Select a list</h3>
              <p className="text-muted-foreground">Choose a list from the sidebar to view its contents</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit List Dialog */}
      {editingList && (
        <Dialog open={!!editingList} onOpenChange={() => setEditingList(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Read List</DialogTitle>
            </DialogHeader>
            <ReadListForm 
              list={editingList} 
              onSuccess={() => setEditingList(null)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface ReadListFormProps {
  list?: ReadList;
  onSuccess: () => void;
}

const ReadListForm: React.FC<ReadListFormProps> = ({ list, onSuccess }) => {
  const { addReadList, updateReadList } = useApp();
  
  const [name, setName] = useState(list?.name || '');
  const [color, setColor] = useState(list?.color || '#d4a574');

  const presetColors = [
    '#d4a574', // Gold
    '#10b981', // Green
    '#f59e0b', // Amber
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316', // Orange
    '#ec4899', // Pink
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter a list name');
      return;
    }

    const listData = {
      name: name.trim(),
      color,
      userId: 'current-user',
      isDefault: false,
    };

    if (list) {
      updateReadList(list.id, listData);
    } else {
      addReadList(listData);
    }
    
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">List Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter list name"
          required
        />
      </div>

      <div>
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {presetColors.map((presetColor) => (
            <button
              key={presetColor}
              type="button"
              className={`w-8 h-8 rounded-full border-2 ${
                color === presetColor ? 'border-foreground' : 'border-border'
              }`}
              style={{ backgroundColor: presetColor }}
              onClick={() => setColor(presetColor)}
            />
          ))}
        </div>
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-20 h-10 mt-2"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {list ? 'Update List' : 'Create List'}
        </Button>
      </div>
    </form>
  );
};

export default ReadListsPage;