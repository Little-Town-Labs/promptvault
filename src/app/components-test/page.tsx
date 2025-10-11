'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function ComponentsTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">✅ shadcn/ui Components Test</h1>
        <p className="text-muted-foreground">
          Testing 6 core components installed for Prompt Vault
        </p>
      </div>

      <div className="h-px bg-border" />

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Different button variants and sizes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Components */}
      <Card>
        <CardHeader>
          <CardTitle>Form Components</CardTitle>
          <CardDescription>Inputs, textareas, and labels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Submit</Button>
        </CardFooter>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Display status and labels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>Published</Badge>
            <Badge variant="secondary">Draft</Badge>
            <Badge variant="outline">Archived</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Cards Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Cards</CardTitle>
          <CardDescription>
            Card component with header, content, and footer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cards are versatile containers that can hold any content. They include
            optional header, content, and footer sections.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </CardFooter>
      </Card>

      {/* Status Card */}
      <Card className="border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            Core Components Working!
          </CardTitle>
          <CardDescription>
            6 essential components are installed and functional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Installed Components:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Badge variant="outline">Button</Badge>
              <Badge variant="outline">Input</Badge>
              <Badge variant="outline">Label</Badge>
              <Badge variant="outline">Textarea</Badge>
              <Badge variant="outline">Card</Badge>
              <Badge variant="outline">Badge</Badge>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-semibold mb-2">What You Can Build:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>✅ Forms (login, create prompts, settings)</li>
              <li>✅ Dashboard layouts with cards</li>
              <li>✅ Button interactions</li>
              <li>✅ Input fields and text areas</li>
              <li>✅ Status indicators with badges</li>
              <li>✅ Landing pages</li>
            </ul>
          </div>

          <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
              📝 Installing Additional Components
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              To install more components (dropdown, dialog, table, etc.), run on your
              local machine:
            </p>
            <code className="block bg-blue-100 dark:bg-blue-900 p-2 rounded text-xs">
              pnpx shadcn@latest add dropdown-menu dialog table
            </code>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Next Steps Card */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Next Steps</CardTitle>
          <CardDescription>Continue building your application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold mb-2">Recommended Order:</h4>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Complete Day 5: Create layout components (navbar, sidebar)</li>
              <li>Build dashboard page with cards and buttons</li>
              <li>Create prompt form with inputs and textareas</li>
              <li>Add more components as needed (dropdown, dialog, etc.)</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Continue to Day 5 →</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
