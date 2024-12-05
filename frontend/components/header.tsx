'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/app/supabase-provider'

export default function Header() {
  const pathname = usePathname()
  const { supabase, session } = useSupabase()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          3D Print Shop
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className={pathname === '/' ? 'text-primary' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className={pathname === '/products' ? 'text-primary' : ''}>
                Products
              </Link>
            </li>
            {session ? (
              <>
                <li>
                  <Link href="/orders" className={pathname === '/orders' ? 'text-primary' : ''}>
                    My Orders
                  </Link>
                </li>
                <li>
                  <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className={pathname === '/login' ? 'text-primary' : ''}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

