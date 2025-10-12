'use client'

import { useEffect, useState } from 'react'
import { useOrganization, useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useTheme } from 'next-themes'
import { Users, Crown, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Preferences {
  defaultVisibility: 'PRIVATE' | 'ORGANIZATION' | 'PUBLIC'
  notificationsEnabled: boolean
  autoSaveEnabled: boolean
}

export default function SettingsPage() {
  const { user } = useUser()
  const { organization, membership } = useOrganization()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  const [preferences, setPreferences] = useState<Preferences>({
    defaultVisibility: 'ORGANIZATION',
    notificationsEnabled: true,
    autoSaveEnabled: true,
  })

  const [isSavingPreferences, setIsSavingPreferences] = useState(false)

  // Prevent hydration mismatch for theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePreferenceChange = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const savePreferences = async () => {
    setIsSavingPreferences(true)
    try {
      // Simulate API call - in a real app, this would save to the backend
      await new Promise(resolve => setTimeout(resolve, 500))

      // Store in localStorage for demo purposes
      localStorage.setItem('userPreferences', JSON.stringify(preferences))

      toast({
        title: 'Success',
        description: 'Preferences saved successfully',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save preferences',
      })
    } finally {
      setIsSavingPreferences(false)
    }
  }

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('userPreferences')
    if (saved) {
      try {
        setPreferences(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load preferences:', error)
      }
    }
  }, [])

  const getPlanBadge = (plan?: string) => {
    const planColors = {
      FREE: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
      STARTER: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      PRO: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      ENTERPRISE: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
    }
    const currentPlan = (plan?.toUpperCase() as keyof typeof planColors) || 'FREE'
    return (
      <span className={`px-2 py-1 rounded-md text-sm font-medium ${planColors[currentPlan]}`}>
        {currentPlan}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information is managed by Clerk</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                defaultValue={user?.firstName || ''}
                placeholder="Enter first name"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                defaultValue={user?.lastName || ''}
                placeholder="Enter last name"
                disabled
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={user?.emailAddresses[0]?.emailAddress || ''}
              disabled
            />
            <p className="text-sm text-muted-foreground">
              Email is managed by your authentication provider
            </p>
          </div>
          <Button asChild>
            <Link href="/user-profile" target="_blank">
              Manage Profile in Clerk
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Manage your organization settings and team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {organization ? (
            <>
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <div className="flex items-center gap-3">
                  <Input
                    value={organization.name}
                    disabled
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Current Plan</Label>
                  <div className="flex items-center gap-2">
                    {getPlanBadge('FREE')}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Your Role</Label>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-md text-sm font-medium bg-primary/10 text-primary flex items-center gap-1">
                      {membership?.role === 'org:admin' && <Crown className="h-3 w-3" />}
                      {membership?.role === 'org:admin' ? 'Admin' : 'Member'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Team Members</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {organization.membersCount || 1} member{(organization.membersCount || 1) !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <Button asChild variant="outline">
                  <Link href="/organization-profile" target="_blank">
                    Manage Organization in Clerk
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p className="mb-4">You are not part of an organization</p>
              <Button asChild>
                <Link href="/create-organization">Create Organization</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Keys Section */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage API keys for programmatic access</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Create and manage API keys to access your prompts programmatically
          </p>
          <Button asChild>
            <Link href="/settings/api-keys">Manage API Keys</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={mounted ? theme : 'system'}
              onValueChange={setTheme}
              disabled={!mounted}
            >
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose your preferred color theme
            </p>
          </div>

          <div className="space-y-2">
            <Label>Default Prompt Visibility</Label>
            <Select
              value={preferences.defaultVisibility}
              onValueChange={(value: Preferences['defaultVisibility']) =>
                handlePreferenceChange('defaultVisibility', value)
              }
            >
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIVATE">Private (Only you)</SelectItem>
                <SelectItem value="ORGANIZATION">Organization (Team members)</SelectItem>
                <SelectItem value="PUBLIC">Public (Everyone)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Default visibility when creating new prompts
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about prompt updates and comments
              </p>
            </div>
            <Switch
              checked={preferences.notificationsEnabled}
              onCheckedChange={(checked) =>
                handlePreferenceChange('notificationsEnabled', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-save</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save changes as you type
              </p>
            </div>
            <Switch
              checked={preferences.autoSaveEnabled}
              onCheckedChange={(checked) =>
                handlePreferenceChange('autoSaveEnabled', checked)
              }
            />
          </div>

          <div className="pt-4 border-t">
            <Button onClick={savePreferences} disabled={isSavingPreferences}>
              {isSavingPreferences ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
