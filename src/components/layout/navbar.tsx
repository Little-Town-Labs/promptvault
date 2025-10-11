import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-8 flex items-center space-x-2">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">📝</span>
            <span className="hidden font-bold sm:inline-block">
              Prompt Vault
            </span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/prompts"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Prompts
          </Link>
          <Link
            href="/categories"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Categories
          </Link>
        </nav>

        {/* Right side - Search and User Menu */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <span className="hidden sm:inline">Search</span>
            <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-9 w-9',
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}
