'use client';

import type { ClientTask } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';


interface TaskChecklistProps {
  tasks: ClientTask[];
  onTaskCompletionChange: (taskId: string, newCompletions: number) => void;
  editable?: boolean;
}


export default function TaskChecklist({ tasks, onTaskCompletionChange, editable = true }: TaskChecklistProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const Icon = task.icon;
        const isCompleted = task.completions >= task.target;

        return (
          <div
            key={task.id}
            className="flex items-center gap-4 rounded-md border p-4 transition-colors data-[completed=true]:bg-accent/50"
            data-completed={isCompleted}
          >
            <div
              className={cn(
                'flex-grow flex items-center gap-3 text-lg font-medium transition-all',
                isCompleted && 'text-muted-foreground line-through'
              )}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isCompleted ? 'text-muted-foreground' : 'text-primary')} />
              <span>{task.text}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onTaskCompletionChange(task.id, Math.max(0, task.completions - 1))}
                disabled={task.completions === 0 || !editable}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-lg font-semibold">
                {task.completions} / {task.target}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onTaskCompletionChange(task.id, task.completions + 1)}
                disabled={isCompleted || !editable}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
