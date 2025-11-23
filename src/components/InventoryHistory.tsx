import { useEffect, useState } from 'react';
import { InventoryLog, productsApi } from '@/lib/api';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

interface InventoryHistoryProps {
  productId: number | null;
  productName: string;
  onClose: () => void;
}

export const InventoryHistory = ({ productId, productName, onClose }: InventoryHistoryProps) => {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (productId === null) return;

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const data = await productsApi.getHistory(productId);
        setLogs(data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [productId]);

  return (
    <Sheet open={productId !== null} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Inventory History: {productName}</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No history available</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
                    </span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {log.changedBy}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-semibold">{log.oldStock}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-semibold text-primary">{log.newStock}</span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {log.newStock > log.oldStock ? (
                        <span className="text-success">+{log.newStock - log.oldStock}</span>
                      ) : (
                        <span className="text-destructive">{log.newStock - log.oldStock}</span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
