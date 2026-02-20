export function LoadingLogo({ className = '', size = 48, ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`animate-pulse ${className}`}
            aria-hidden
            {...props}
        >
            <path d="M2 6h4v12H2z" />
            <path d="M6 12h12" />
            <path d="M18 6h4v12h-4z" />
        </svg>
    );
}
