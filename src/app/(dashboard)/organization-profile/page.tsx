import { OrganizationProfile } from '@clerk/nextjs'

export default function OrganizationProfilePage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your organization settings, members, and billing
          </p>
        </div>
        <OrganizationProfile
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-lg',
            },
          }}
        />
      </div>
    </div>
  )
}
