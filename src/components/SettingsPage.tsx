import React from 'react';
import { Settings, User, Bell, Shield, Palette, Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useApp } from '../context/AppContext';

const SettingsPage: React.FC = () => {
  const { currentUser, dashboardStats } = useApp();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={currentUser?.username || ''} readOnly />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={currentUser?.email || ''} readOnly />
            </div>
          </div>
          <Button variant="outline" disabled>
            <User className="w-4 h-4 mr-2" />
            Edit Profile (Coming Soon)
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>New Story Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified when new stories are added</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Author Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified when authors update their stories</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Community Activity</Label>
              <p className="text-sm text-muted-foreground">Get notified about discussions and comments</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Public Profile</Label>
              <p className="text-sm text-muted-foreground">Allow others to see your reading lists</p>
            </div>
            <Switch />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Reading Activity</Label>
              <p className="text-sm text-muted-foreground">Display what you're currently reading</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Discussion Privacy</Label>
              <p className="text-sm text-muted-foreground">Default privacy level for your discussions</p>
            </div>
            <Badge variant="outline">Public</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
            </div>
            <Badge className="bg-primary text-primary-foreground">Golden</Badge>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Compact View</Label>
              <p className="text-sm text-muted-foreground">Show more items in lists</p>
            </div>
            <Switch />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Switch to dark theme</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{dashboardStats.totalStories}</div>
              <div className="text-sm text-muted-foreground">Total Stories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{dashboardStats.totalAuthors}</div>
              <div className="text-sm text-muted-foreground">Total Authors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{dashboardStats.totalStoriesRead}</div>
              <div className="text-sm text-muted-foreground">Stories Read</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" disabled>
              Import Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="destructive" disabled>
              Delete Account
            </Button>
          </div>
          
          <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <h4 className="font-medium text-destructive mb-2">Clear All Data</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Remove all stories, authors, and read lists from your account.
            </p>
            <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" disabled>
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About Golden Catalogue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Created:</strong> September 2025</p>
            <p><strong>Purpose:</strong> Personal fanfiction library and reading tracker</p>
            <p><strong>Features:</strong> Story management, author database, custom read lists, community discussions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;