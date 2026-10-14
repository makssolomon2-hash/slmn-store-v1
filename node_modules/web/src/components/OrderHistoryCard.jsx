
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const OrderHistoryCard = ({ order }) => {
  const orderDate = order.orderDate ? new Date(order.orderDate) : new Date(order.created);
  const items = order.items || [];

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-card-foreground/60 mb-1">Order ID</p>
            <p className="font-mono text-sm">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-card-foreground/60 mb-1">Total</p>
            <p className="text-xl font-bold text-primary">
              ${order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-center text-sm text-card-foreground/70 mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          {format(orderDate, 'MMM dd, yyyy')}
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium">Items:</p>
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm text-card-foreground/80">
              <span>{item.productName || item.name}</span>
              <span>${(item.price || 0).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {order.status === 'completed' && (
          <div className="space-y-2">
            {items.map((item, index) => (
              item.downloadUrl && (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <a href={item.downloadUrl} download>
                    <Download className="w-4 h-4 mr-2" />
                    Download {item.productName || item.name}
                  </a>
                </Button>
              )
            ))}
          </div>
        )}

        {order.status === 'pending' && (
          <p className="text-sm text-muted-foreground">Payment processing...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistoryCard;
