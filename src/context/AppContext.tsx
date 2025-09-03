import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Story, Author, ReadList, ReadListItem, Discussion, StoryFilters, DashboardStats } from '../types';

interface AppContextType {
  // User & Authentication
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Stories
  stories: Story[];
  setStories: (stories: Story[]) => void;
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStory: (id: string, updates: Partial<Story>) => void;
  deleteStory: (id: string) => void;
  
  // Authors
  authors: Author[];
  setAuthors: (authors: Author[]) => void;
  addAuthor: (author: Omit<Author, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAuthor: (id: string, updates: Partial<Author>) => void;
  deleteAuthor: (id: string) => void;
  
  // Read Lists
  readLists: ReadList[];
  setReadLists: (lists: ReadList[]) => void;
  addReadList: (list: Omit<ReadList, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReadList: (id: string, updates: Partial<ReadList>) => void;
  deleteReadList: (id: string) => void;
  
  // Read List Items
  readListItems: ReadListItem[];
  setReadListItems: (items: ReadListItem[]) => void;
  addToReadList: (readListId: string, storyId: string) => void;
  removeFromReadList: (readListId: string, storyId: string) => void;
  markAsRead: (storyId: string) => void;
  
  // Discussions
  discussions: Discussion[];
  setDiscussions: (discussions: Discussion[]) => void;
  addDiscussion: (discussion: Omit<Discussion, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  // Filters & Search
  storyFilters: StoryFilters;
  setStoryFilters: (filters: StoryFilters) => void;
  
  // Dashboard Stats
  dashboardStats: DashboardStats;
  updateDashboardStats: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock current user - in real app this would come from authentication
  const [currentUser] = useState<User>({
    id: 'user-1',
    username: 'fanfic_reader',
    email: 'reader@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Initialize with sample data
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('golden-catalogue-stories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((story: any) => ({
          ...story,
          createdAt: new Date(story.createdAt),
          updatedAt: new Date(story.updatedAt),
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  const [authors, setAuthors] = useState<Author[]>(() => {
    const saved = localStorage.getItem('golden-catalogue-authors');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((author: any) => ({
          ...author,
          createdAt: new Date(author.createdAt),
          updatedAt: new Date(author.updatedAt),
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  const [readLists, setReadLists] = useState<ReadList[]>(() => {
    const saved = localStorage.getItem('golden-catalogue-readlists');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((list: any) => ({
          ...list,
          createdAt: new Date(list.createdAt),
          updatedAt: new Date(list.updatedAt),
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  const [readListItems, setReadListItems] = useState<ReadListItem[]>(() => {
    const saved = localStorage.getItem('golden-catalogue-readlist-items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
          story: {
            ...item.story,
            createdAt: new Date(item.story.createdAt),
            updatedAt: new Date(item.story.updatedAt),
          }
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [storyFilters, setStoryFilters] = useState<StoryFilters>({});
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalStoriesRead: 0,
    totalAuthorsRead: 0,
    currentlyReading: 0,
    totalStories: 0,
    totalAuthors: 0,
  });

  // Initialize default read lists and sample data
  useEffect(() => {
    if (currentUser && readLists.length === 0) {
      const defaultLists: ReadList[] = [
        {
          id: 'done-list',
          name: 'Done',
          userId: currentUser.id,
          isDefault: true,
          color: '#10b981',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'pending-list',
          name: 'Pending',
          userId: currentUser.id,
          isDefault: true,
          color: '#f59e0b',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'bookmark-list',
          name: 'Bookmark',
          userId: currentUser.id,
          isDefault: true,
          color: '#e6b800',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setReadLists(defaultLists);
    }
    
    // Initialize with sample data if empty
    if (authors.length === 0 && stories.length === 0) {
      import('../data/sampleData').then(({ sampleAuthors, sampleStories }) => {
        setAuthors(sampleAuthors);
        setStories(sampleStories);
        
        // Add some stories to read lists for demo
        setTimeout(() => {
          const demoReadItems: ReadListItem[] = [
            {
              id: 'item-demo-1',
              readListId: 'done-list',
              storyId: 'story-1',
              story: sampleStories[0],
              addedAt: new Date(),
              isRead: true,
            },
            {
              id: 'item-demo-2',
              readListId: 'done-list',
              storyId: 'story-2',
              story: sampleStories[1],
              addedAt: new Date(),
              isRead: true,
            },
            {
              id: 'item-demo-3',
              readListId: 'pending-list',
              storyId: 'story-3',
              story: sampleStories[2],
              addedAt: new Date(),
              isRead: false,
            },
            {
              id: 'item-demo-4',
              readListId: 'pending-list',
              storyId: 'story-5',
              story: sampleStories[4],
              addedAt: new Date(),
              isRead: false,
            },
          ];
          setReadListItems(demoReadItems);
        }, 100);
      });
    }
  }, [currentUser, readLists.length, authors.length, stories.length]);

  // Persist data to localStorage
  useEffect(() => {
    if (stories.length > 0) {
      localStorage.setItem('golden-catalogue-stories', JSON.stringify(stories));
    }
  }, [stories]);

  useEffect(() => {
    if (authors.length > 0) {
      localStorage.setItem('golden-catalogue-authors', JSON.stringify(authors));
    }
  }, [authors]);

  useEffect(() => {
    if (readLists.length > 0) {
      localStorage.setItem('golden-catalogue-readlists', JSON.stringify(readLists));
    }
  }, [readLists]);

  useEffect(() => {
    if (readListItems.length > 0) {
      localStorage.setItem('golden-catalogue-readlist-items', JSON.stringify(readListItems));
    }
  }, [readListItems]);

  const addStory = (storyData: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStory: Story = {
      ...storyData,
      id: `story-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setStories(prev => [...prev, newStory]);
  };

  const updateStory = (id: string, updates: Partial<Story>) => {
    setStories(prev => prev.map(story => 
      story.id === id ? { ...story, ...updates, updatedAt: new Date() } : story
    ));
  };

  const deleteStory = (id: string) => {
    setStories(prev => prev.filter(story => story.id !== id));
    setReadListItems(prev => prev.filter(item => item.storyId !== id));
  };

  const addAuthor = (authorData: Omit<Author, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAuthor: Author = {
      ...authorData,
      id: `author-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAuthors(prev => [...prev, newAuthor]);
  };

  const updateAuthor = (id: string, updates: Partial<Author>) => {
    setAuthors(prev => prev.map(author => 
      author.id === id ? { ...author, ...updates, updatedAt: new Date() } : author
    ));
  };

  const deleteAuthor = (id: string) => {
    setAuthors(prev => prev.filter(author => author.id !== id));
  };

  const addReadList = (listData: Omit<ReadList, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newList: ReadList = {
      ...listData,
      id: `list-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setReadLists(prev => [...prev, newList]);
  };

  const updateReadList = (id: string, updates: Partial<ReadList>) => {
    setReadLists(prev => prev.map(list => 
      list.id === id ? { ...list, ...updates, updatedAt: new Date() } : list
    ));
  };

  const deleteReadList = (id: string) => {
    setReadLists(prev => prev.filter(list => list.id !== id));
    setReadListItems(prev => prev.filter(item => item.readListId !== id));
  };

  const addToReadList = (readListId: string, storyId: string) => {
    const existing = readListItems.find(item => 
      item.readListId === readListId && item.storyId === storyId
    );
    
    if (!existing) {
      const story = stories.find(s => s.id === storyId);
      if (story) {
        const newItem: ReadListItem = {
          id: `item-${Date.now()}`,
          readListId,
          storyId,
          story,
          addedAt: new Date(),
          isRead: readListId === 'done-list',
        };
        setReadListItems(prev => [...prev, newItem]);
      }
    }
  };

  const removeFromReadList = (readListId: string, storyId: string) => {
    setReadListItems(prev => prev.filter(item => 
      !(item.readListId === readListId && item.storyId === storyId)
    ));
  };

  const markAsRead = (storyId: string) => {
    // Remove from pending list and add to done list
    removeFromReadList('pending-list', storyId);
    addToReadList('done-list', storyId);
  };

  const addDiscussion = (discussionData: Omit<Discussion, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDiscussion: Discussion = {
      ...discussionData,
      id: `discussion-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDiscussions(prev => [...prev, newDiscussion]);
  };

  const updateDashboardStats = () => {
    const doneItems = readListItems.filter(item => item.readListId === 'done-list');
    const pendingItems = readListItems.filter(item => item.readListId === 'pending-list');
    const uniqueAuthorsRead = new Set(doneItems.map(item => item.story.authorId));

    setDashboardStats({
      totalStoriesRead: doneItems.length,
      totalAuthorsRead: uniqueAuthorsRead.size,
      currentlyReading: pendingItems.length,
      totalStories: stories.length,
      totalAuthors: authors.length,
    });
  };

  useEffect(() => {
    updateDashboardStats();
  }, [stories, authors, readListItems]);

  const value: AppContextType = {
    currentUser,
    setCurrentUser: () => {}, // Mock implementation
    stories,
    setStories,
    addStory,
    updateStory,
    deleteStory,
    authors,
    setAuthors,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    readLists,
    setReadLists,
    addReadList,
    updateReadList,
    deleteReadList,
    readListItems,
    setReadListItems,
    addToReadList,
    removeFromReadList,
    markAsRead,
    discussions,
    setDiscussions,
    addDiscussion,
    storyFilters,
    setStoryFilters,
    dashboardStats,
    updateDashboardStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};