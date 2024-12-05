'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useSupabase } from '@/app/supabase-provider'

const products = [
  { id: 1, name: 'Custom Figurine', price: 29.99 },
  { id: 2, name: 'Architectural Model', price: 99.99 },
  { id: 3, name: 'Prototype Part', price: 49.99 },
]

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { supabase, session } = useSupabase()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [material, setMaterial] = useState('PLA')
  const [color, setColor] = useState('White')

  const product = products.find(p => p.id === parseInt(params.id))

  if (!product) {
    return <div>Product not found</div>
  }

  const handleOrder = async () => {
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to place an order.",
        variant: "destructive",
      })
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: session.user.id,
        product_name: product.name,
        quantity,
        material,
        color,
        status: 'Pending'
      })

    if (error) {
      toast({
        title: "Error",
        description: "There was an error placing your order.",
        variant: "destructive",
      })
    } else {
      setIsDialogOpen(false)
      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed.",
      })
      router.push('/orders')
    }
  }

  const estimatedTime = quantity * 2 // 2 hours per item, for example

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
      <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>Order Now</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Settings</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material" className="text-right">
                Material
              </Label>
              <Select value={material} onValueChange={setMaterial}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLA">PLA</SelectItem>
                  <SelectItem value="ABS">ABS</SelectItem>
                  <SelectItem value="PETG">PETG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="Red">Red</SelectItem>
                  <SelectItem value="Blue">Blue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Estimated Time</Label>
              <div className="col-span-3">{estimatedTime} hours</div>
            </div>
          </div>
          <Button onClick={handleOrder}>Place Order</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

