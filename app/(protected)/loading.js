import { LoadingLogo } from '@/components/ui/loading-logo';

export default function Loading() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:p-6">
            <LoadingLogo className="text-muted-foreground" size={48} />
            <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
    );
}
