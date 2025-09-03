import React, { useState } from 'react';
import { MessageCircle, Plus, Eye, Users, Lock, Send, Heart, Reply } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { useApp } from '../context/AppContext';
import { Discussion } from '../types';

const DiscussionsPage: React.FC = () => {
  const { discussions, stories, currentUser, addDiscussion } = useApp();
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [selectedStory, setSelectedStory] = useState<string>('');
  const [filterVisibility, setFilterVisibility] = useState<string>('all');

  const filteredDiscussions = discussions.filter(discussion => {
    if (filterVisibility === 'all') return true;
    return discussion.visibility === filterVisibility;
  });

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Eye className="w-4 h-4" />;
      case 'followers': return <Users className="w-4 h-4" />;
      case 'private-group': return <Lock className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public': return 'text-green-600 bg-green-50';
      case 'followers': return 'text-blue-600 bg-blue-50';
      case 'private-group': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Discussions</h1>
          <p className="text-muted-foreground">Join conversations about your favorite stories</p>
        </div>
        <Dialog open={showNewDiscussion} onOpenChange={setShowNewDiscussion}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Start Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Start New Discussion</DialogTitle>
            </DialogHeader>
            <NewDiscussionForm onSuccess={() => setShowNewDiscussion(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedStory} onValueChange={setSelectedStory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by story" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Stories</SelectItem>
            {stories.map((story) => (
              <SelectItem key={story.id} value={story.id}>
                {story.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterVisibility} onValueChange={setFilterVisibility}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="followers">Followers</SelectItem>
            <SelectItem value="private-group">Private Group</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.length > 0 ? (
          filteredDiscussions.map((discussion) => (
            <DiscussionCard key={discussion.id} discussion={discussion} />
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No discussions yet</h3>
              <p className="text-muted-foreground mb-4">
                Start the conversation by creating the first discussion!
              </p>
              <Button onClick={() => setShowNewDiscussion(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Start First Discussion
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

interface DiscussionCardProps {
  discussion: Discussion;
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({ discussion }) => {
  const { stories } = useApp();
  const story = stories.find(s => s.id === discussion.storyId);

  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {discussion.user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-foreground">{discussion.user.username}</span>
                <Badge className={`text-xs flex items-center gap-1 ${getVisibilityColor(discussion.visibility)}`}>
                  {getVisibilityIcon(discussion.visibility)}
                  {discussion.visibility}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(discussion.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {story && (
                <p className="text-sm text-muted-foreground mb-2">
                  Discussing: <span className="font-medium">{story.title}</span>
                  {discussion.chapterNumber && (
                    <span> • Chapter {discussion.chapterNumber}</span>
                  )}
                </p>
              )}
              
              {discussion.quote && (
                <blockquote className="border-l-4 border-primary/30 pl-3 mb-2 text-sm italic text-muted-foreground">
                  "{discussion.quote}"
                </blockquote>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-foreground mb-4">{discussion.content}</p>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <Heart className="w-4 h-4 mr-1" />
            Like
          </Button>
          <Button variant="ghost" size="sm">
            <Reply className="w-4 h-4 mr-1" />
            Reply
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="w-4 h-4 mr-1" />
            0 Replies
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const NewDiscussionForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { stories, currentUser, addDiscussion } = useApp();
  const [formData, setFormData] = useState({
    storyId: '',
    content: '',
    chapterNumber: '',
    quote: '',
    visibility: 'public' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.storyId || !formData.content.trim()) {
      alert('Please select a story and enter your discussion content');
      return;
    }

    if (!currentUser) return;

    const discussionData = {
      storyId: formData.storyId,
      userId: currentUser.id,
      user: currentUser,
      content: formData.content.trim(),
      chapterNumber: formData.chapterNumber ? parseInt(formData.chapterNumber) : undefined,
      quote: formData.quote.trim() || undefined,
      visibility: formData.visibility,
    };

    addDiscussion(discussionData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Story *</Label>
        <Select 
          value={formData.storyId} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, storyId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a story to discuss" />
          </SelectTrigger>
          <SelectContent>
            {stories.map((story) => (
              <SelectItem key={story.id} value={story.id}>
                {story.title} by {story.author.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Chapter Number (Optional)</Label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-border rounded-md"
            placeholder="Chapter #"
            value={formData.chapterNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, chapterNumber: e.target.value }))}
          />
        </div>

        <div>
          <Label>Visibility</Label>
          <Select 
            value={formData.visibility} 
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, visibility: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public - Everyone can see</SelectItem>
              <SelectItem value="followers">Followers - Only followers can see</SelectItem>
              <SelectItem value="private-group">Private Group - Only group members</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Quote (Optional)</Label>
        <Textarea
          placeholder="Quote a specific part of the story you want to discuss..."
          value={formData.quote}
          onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))}
          rows={2}
        />
      </div>

      <div>
        <Label>Discussion Content *</Label>
        <Textarea
          placeholder="What are your thoughts? Share your analysis, theories, or reactions..."
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          rows={4}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          <Send className="w-4 h-4 mr-2" />
          Start Discussion
        </Button>
      </div>
    </form>
  );
};

export default DiscussionsPage;