import { Activity } from 'lucide-react';

export function LoadingLogo({ className = '', size = 48, ...props }) {
    return (
        <Activity
            size={size}
            className={`animate-pulse ${className}`}
            aria-hidden
            {...props}
        />
    );
}
