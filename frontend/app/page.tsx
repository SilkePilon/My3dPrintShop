import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to 3D Print Shop</h1>
      <p className="text-xl mb-8">Order custom 3D prints with ease</p>
      <Button asChild>
        <Link href="/products">Browse Products</Link>
      </Button>
    </div>
  )
}

