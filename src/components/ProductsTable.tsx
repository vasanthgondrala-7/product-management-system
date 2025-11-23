import { useState } from 'react';
import { Product } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Edit2, Save, X, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProductsTableProps {
  products: Product[];
  onEdit: (id: number, data: Partial<Product>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onSelectProduct: (product: Product) => void;
  isLoading?: boolean;
}

export const ProductsTable = ({ products, onEdit, onDelete, onSelectProduct, isLoading }: ProductsTableProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      unit: product.unit,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      status: product.status,
    });
  };

  const handleSave = async () => {
    if (editingId === null) return;
    try {
      await onEdit(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-4 font-semibold">Image</th>
              <th className="text-left p-4 font-semibold">Name</th>
              <th className="text-left p-4 font-semibold">Unit</th>
              <th className="text-left p-4 font-semibold">Category</th>
              <th className="text-left p-4 font-semibold">Brand</th>
              <th className="text-left p-4 font-semibold">Stock</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isEditing = editingId === product.id;
              
              return (
                <tr
                  key={product.id}
                  className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => !isEditing && onSelectProduct(product)}
                >
                  <td className="p-4">
                    <img
                      src={product.image || 'https://via.placeholder.com/50'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <Input
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="font-medium">{product.name}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <Input
                        value={editForm.unit || ''}
                        onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      product.unit
                    )}
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <Input
                        value={editForm.category || ''}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      product.category
                    )}
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <Input
                        value={editForm.brand || ''}
                        onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      product.brand
                    )}
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editForm.stock || 0}
                        onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) || 0 })}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td className="p-4">
                    <Badge variant={product.status === 'In Stock' ? 'default' : 'destructive'} className={product.status === 'In Stock' ? 'bg-success' : ''}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="default" onClick={handleSave}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(product)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeleteId(product.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
