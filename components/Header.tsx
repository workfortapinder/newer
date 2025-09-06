import Link from 'next/link';
import { Trophy } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <nav className="flex w-full items-center gap-6 text-lg font-medium md:text-sm">
        <Link
          href="/"
          className="flex items-center gap-2 font-headline text-lg font-semibold text-foreground transition-colors hover:text-foreground/80"
        >
          <Trophy className="h-6 w-6 text-primary" />
          <span>Vaulted Ambition</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
