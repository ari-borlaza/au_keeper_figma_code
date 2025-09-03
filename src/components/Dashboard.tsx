import React from 'react';
import { Book, Users, BookOpen, TrendingUp, Library, BookMarked } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useApp } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const { dashboardStats, readListItems, stories } = useApp();

  const recentlyAdded = stories
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentlyRead = readListItems
    .filter(item => item.readListId === 'done-list')
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 5);

  const statsCards = [
    {
      title: 'Stories Read',
      value: dashboardStats.totalStoriesRead,
      icon: Book,
      description: 'Completed stories',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Authors Read',
      value: dashboardStats.totalAuthorsRead,
      icon: Users,
      description: 'Unique authors',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Currently Reading',
      value: dashboardStats.currentlyReading,
      icon: BookOpen,
      description: 'In progress',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Total Stories',
      value: dashboardStats.totalStories,
      icon: Library,
      description: 'In catalogue',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2" style={{fontFamily: 'var(--font-family-serif)'}}>
          A fan-created, fan-run, nonprofit, noncommercial archive for transformative fanworks, like fanfiction, fanart, fan videos, and podfic
        </h1>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-muted-foreground" style={{fontFamily: 'var(--font-family-serif)'}}>
            more than <strong>73,630</strong> fandoms | <strong>9,161,000</strong> works | <strong>15,730,000</strong> words
          </p>
          <p className="text-sm text-muted-foreground" style={{fontFamily: 'var(--font-family-serif)'}}>
            The Golden Catalogue is a project of the <span className="text-primary underline">Organization for Transformative Works</span>.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="border border-border bg-card text-center">
              <CardContent className="p-4">
                <div className="text-xl font-bold text-foreground" style={{fontFamily: 'var(--font-family-serif)'}}>{stat.value}</div>
                <p className="text-sm text-muted-foreground mt-1" style={{fontFamily: 'var(--font-family-sans)'}}>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Added Stories */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{fontFamily: 'var(--font-family-serif)'}}>
              <TrendingUp className="w-5 h-5 text-primary" />
              Recently Added Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentlyAdded.length > 0 ? (
              <div className="space-y-3">
                {recentlyAdded.map((story) => (
                  <div key={story.id} className="border-b border-border pb-3 last:border-b-0">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-primary hover:underline cursor-pointer" style={{fontFamily: 'var(--font-family-serif)'}}>{story.title}</h4>
                      <p className="text-sm text-muted-foreground" style={{fontFamily: 'var(--font-family-serif)'}}>by {story.author.name}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground" style={{fontFamily: 'var(--font-family-sans)'}}>
                        <span>{story.source}</span>
                        <span>{story.category}</span>
                        <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Book className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No stories added yet</p>
                <p className="text-sm">Start building your collection!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recently Read */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{fontFamily: 'var(--font-family-serif)'}}>
              <BookOpen className="w-5 h-5 text-primary" />
              Recently Read
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentlyRead.length > 0 ? (
              <div className="space-y-3">
                {recentlyRead.map((item) => (
                  <div key={item.id} className="border-b border-border pb-3 last:border-b-0">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-primary hover:underline cursor-pointer" style={{fontFamily: 'var(--font-family-serif)'}}>{item.story.title}</h4>
                      <p className="text-sm text-muted-foreground" style={{fontFamily: 'var(--font-family-serif)'}}>by {item.story.author.name}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground" style={{fontFamily: 'var(--font-family-sans)'}}>
                        <span>{item.story.source}</span>
                        {item.story.ships.length > 0 && <span>{item.story.ships[0]}</span>}
                        <span>{new Date(item.addedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p style={{fontFamily: 'var(--font-family-serif)'}}>No stories read yet</p>
                <p className="text-sm" style={{fontFamily: 'var(--font-family-serif)'}}>Mark some stories as read!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;