export const metadata = {
  title: 'Offline • Vaulted Ambition',
};

export default function OfflinePage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold">You&apos;re offline</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Don&apos;t worry, you can still browse cached pages. We&apos;ll reconnect
          automatically when the network is back.
        </p>
      </div>
    </main>
  );
}
