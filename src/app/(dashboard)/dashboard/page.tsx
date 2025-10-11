import { currentUser } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
  const user = await currentUser()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName || 'there'}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s what&apos;s happening with your prompts today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <span className="text-2xl">📝</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No prompts yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <span className="text-2xl">🏷️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Create your first category</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <span className="text-2xl">📁</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Organize with collections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <span className="text-2xl">⭐</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Star your favorites</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your prompt library</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button className="h-24 flex flex-col items-center justify-center gap-2">
            <span className="text-2xl">➕</span>
            <span>Create Prompt</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
            <span className="text-2xl">🏷️</span>
            <span>Add Category</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
            <span className="text-2xl">📁</span>
            <span>Create Collection</span>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Prompts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Prompts</CardTitle>
          <CardDescription>Your most recently created or edited prompts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <span className="text-4xl mb-4 block">📝</span>
            <p className="text-lg font-medium mb-2">No prompts yet</p>
            <p className="text-sm mb-4">Create your first prompt to get started</p>
            <Button>Create Your First Prompt</Button>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Learn how to use Prompt Vault effectively</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <Badge className="mt-1">1</Badge>
            <div>
              <h4 className="font-medium">Create your first prompt</h4>
              <p className="text-sm text-muted-foreground">
                Start building your prompt library by creating your first prompt
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Badge className="mt-1">2</Badge>
            <div>
              <h4 className="font-medium">Organize with categories</h4>
              <p className="text-sm text-muted-foreground">
                Create categories to organize prompts by type or purpose
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Badge className="mt-1">3</Badge>
            <div>
              <h4 className="font-medium">Use collections</h4>
              <p className="text-sm text-muted-foreground">
                Group related prompts together in collections for easy access
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Badge className="mt-1">4</Badge>
            <div>
              <h4 className="font-medium">Share and collaborate</h4>
              <p className="text-sm text-muted-foreground">
                Invite team members to collaborate on your prompt library
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
