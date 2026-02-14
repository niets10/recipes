export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex-1 w-full max-w-5xl mx-auto p-5">
            {children}
        </main>
    );
}
