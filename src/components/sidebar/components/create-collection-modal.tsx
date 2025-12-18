import { useState } from 'react';
import { SimpleModalContent, SimpleModalProvider } from '@/components/common/simple-modal/simple-modal';
import { Input } from '@/components/ui/input';

interface CreateCollectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { name: string; description?: string }) => Promise<void>;
    isLoading?: boolean;
}

export function CreateCollectionModal({ open, onOpenChange, onSubmit, isLoading = false }: CreateCollectionModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Collection name is required');
            return;
        }

        setError('');
        try {
            await onSubmit({ name: name.trim(), description: description.trim() || undefined });
            // Reset form on success
            setName('');
            setDescription('');
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create collection');
        }
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        setError('');
        onOpenChange(false);
    };

    return (
        <SimpleModalProvider open={open} onOpenChange={handleClose}>
            <SimpleModalContent
                title="Create Collection"
                description="Create a new collection to organize your projects"
                footerCancel={true}
                footerSubmit="Create"
                footerSubmitLoading={isLoading}
                onFooterSubmitClick={handleSubmit}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="collection-name" className="text-sm font-medium">
                            Name
                        </label>
                        <Input
                            id="collection-name"
                            placeholder="Enter collection name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="collection-description" className="text-sm font-medium">
                            Description (Optional)
                        </label>
                        <textarea
                            id="collection-description"
                            placeholder="Enter collection description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isLoading}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                            rows={3}
                        />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
            </SimpleModalContent>
        </SimpleModalProvider>
    );
}

