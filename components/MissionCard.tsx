
import type { Mission } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';


interface MissionCardProps {
  mission: Mission;
  onDelete?: (id: string) => void;
}

const MissionCard = ({ mission, onDelete }: MissionCardProps) => {
  const totalCompletions = mission.tasks.reduce((sum, task) => sum + task.completions, 0);
  const totalTarget = mission.tasks.reduce((sum, task) => sum + task.target, 0);
  const progress = totalTarget > 0 ? (totalCompletions / totalTarget) * 100 : 0;
  
  const completedTasks = mission.tasks.filter(t => t.completions >= t.target).length;
  const totalTasks = mission.tasks.length;

  return (
    <div className="relative group">
      <Link href={`/missions/${mission.id}`} className="block">
        <Card className="flex h-full flex-col transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="font-headline text-xl leading-tight">{mission.title}</CardTitle>
            <CardDescription className="font-body italic">Reward: {mission.reward}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress ({completedTasks}/{totalTasks} tasks)</span>
                <span>
                  {totalCompletions}/{totalTarget}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Badge variant={progress === 100 ? 'default' : 'secondary'} className="capitalize">
              {mission.timeFrame}
            </Badge>
          </CardFooter>
        </Card>
      </Link>
    {onDelete && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 z-10 opacity-70 hover:opacity-100"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (confirm('Delete this mission?')) onDelete(mission.id); }}
        >
          <Trash2 className="h-5 w-5 text-destructive" />
        </Button>
      )}
    </div>
  );
};

export default MissionCard;
