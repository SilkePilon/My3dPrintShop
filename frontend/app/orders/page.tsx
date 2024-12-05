'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/app/supabase-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Order {
  id: number
  product_name: string
  quantity: number
  material: string
  color: string
  status: string
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const { supabase, session } = useSupabase()

  useEffect(() => {
    if (session) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', session?.user.id)
    
    if (error) {
      console.error('Error fetching orders:', error)
    } else {
      setOrders(data || [])
    }
  }

  if (!session) {
    return <div>Please log in to view your orders.</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>{order.product_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Quantity: {order.quantity}</p>
                <p>Material: {order.material}</p>
                <p>Color: {order.color}</p>
                <p>Status: {order.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

