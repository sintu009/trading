import SignIn from '@/components/Auth/SignIn'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-dark_grey/50 p-8 rounded-lg border border-white/10">
          <SignIn />
        </div>
      </div>
    </div>
  )
}