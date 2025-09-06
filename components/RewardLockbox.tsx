'use client';

import { Vault, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface RewardLockboxProps {
  reward: string;
  rewardImage: string;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  totalCompletions: number;
  totalTarget: number;
}

export default function RewardLockbox({
  reward,
  rewardImage,
  progress,
  completedTasks,
  totalTasks,
  totalCompletions,
  totalTarget
}: RewardLockboxProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (progress >= 100 && !isUnlocked) {
      setTimeout(() => {
        setIsUnlocked(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }, 500);
    } else if (progress < 100 && isUnlocked) {
      setIsUnlocked(false);
    }
  }, [progress, isUnlocked]);

  return (
    <div className="relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm">
       {showConfetti && <Confetti />}
      <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
        <div
          className={cn(
            'relative h-48 w-48 flex-shrink-0 rounded-md border-2 border-dashed border-border flex items-center justify-center transition-all duration-500',
            progress > 0 && 'border-primary/50',
            isUnlocked && 'border-primary'
          )}
        >
          <div
            className={cn(
              'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card transition-opacity duration-700',
              isUnlocked ? 'opacity-0' : 'opacity-100'
            )}
          >
            <Vault
              className={cn(
                'h-16 w-16 text-muted-foreground/50 transition-colors',
                progress > 0 && 'text-primary/30',
                progress > 50 && 'text-primary/60'
              )}
            />
            <span className="text-sm font-medium text-muted-foreground">LOCKED</span>
          </div>
          <div
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 delay-500',
              isUnlocked ? 'opacity-100' : 'opacity-0'
            )}
          >
            {rewardImage && rewardImage.trim() !== '' ? (
              <Image
                src={rewardImage}
                alt={reward}
                fill
                data-ai-hint="reward item"
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <Image
                src={`https://picsum.photos/seed/${encodeURIComponent(reward)}/400/300`}
                alt={reward}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        </div>
        <div className="flex-grow space-y-3">
          <h2 className="font-headline text-2xl font-bold text-foreground">
            {isUnlocked ? 'Reward Unlocked!' : 'Your Reward'}
          </h2>
          <p className="text-3xl font-bold text-primary">{reward}</p>
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Mission Progress ({completedTasks}/{totalTasks} tasks)</span>
              <span>
                {totalCompletions} / {totalTarget} Completions
              </span>
            </div>
            <Progress value={progress} />
          </div>
        </div>
      </div>
    </div>
  );
}


const Confetti = () => {
  const confettiCount = 50;
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: confettiCount }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}%`,
          animation: `fall ${Math.random() * 2 + 2}s ${Math.random() * 2}s linear infinite`,
        };
        return <Sparkles key={i} className="absolute h-4 w-4 text-primary animate-ping" style={style} />;
      })}
       <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(150px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
