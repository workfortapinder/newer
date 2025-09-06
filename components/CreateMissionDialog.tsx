'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, Book, Dumbbell, Feather, Leaf, Repeat, Coffee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Mission, IconName } from '@/lib/types';
import { useState } from 'react';

const iconMap = {
  Book,
  Dumbbell,
  Feather,
  Leaf,
  Repeat,
  Coffee,
};
// Define as a readonly tuple so z.enum() can infer a valid tuple type
const iconNames = ['Book', 'Dumbbell', 'Feather', 'Leaf', 'Repeat', 'Coffee'] as const;

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  reward: z.string().min(2, 'Reward must be at least 2 characters long.'),
  rewardImage: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
  timeFrame: z.enum(['daily', 'weekly', 'monthly']),
  motivation: z.string().optional(),
  tasks: z.array(z.object({
    text: z.string().min(3, 'Task must be at least 3 characters long.'),
    icon: z.enum(iconNames),
    target: z.coerce.number().min(1, 'Target must be at least 1.'),
  })).min(1, 'Please add at least one task.'),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateMissionDialogProps {
  children: ReactNode;
  onMissionCreate: (mission: Omit<Mission, 'id'>) => void;
}

export default function CreateMissionDialog({ children, onMissionCreate }: CreateMissionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      reward: '',
      rewardImage: '',
      timeFrame: 'weekly',
      motivation: '',
      tasks: [{ text: '', icon: 'Feather', target: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tasks',
  });

  const onSubmit = (values: FormValues) => {
    const newMission: Omit<Mission, 'id'> = {
      ...values,
      rewardImage: values.rewardImage || `https://picsum.photos/400/300?random=${Date.now()}`,
      tasks: values.tasks.map((task, index) => ({
        id: `${Date.now()}-${index}`,
        text: task.text,
        completions: 0,
        target: task.target,
        icon: task.icon,
      })),
      motivation: values.motivation || '',
    };
    onMissionCreate(newMission);
    toast({
      title: 'Mission Created!',
      description: `Your new mission "${values.title}" has been added.`,
    });
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Create a New Mission</DialogTitle>
          <DialogDescription>
            Define your goal, set the tasks, and visualize the reward.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mission Title</FormLabel>
                    <FormControl><Input placeholder="e.g., Weekly Fitness" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward</FormLabel>
                    <FormControl><Input placeholder="e.g., New Running Shoes" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="timeFrame"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Frame</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a time frame" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Tasks</FormLabel>
              <div className="mt-2 space-y-2">
                {fields.map((field, index) => (
                   <div key={field.id} className="flex items-start gap-2">
                    <FormField
                      control={form.control}
                      name={`tasks.${index}.icon`}
                      render={({ field }) => (
                        <FormItem>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                               <SelectTrigger className="w-[80px]">
                                <SelectValue>
                                  {iconMap[field.value] && <div className="flex items-center gap-2">{React.createElement(iconMap[field.value], { className: "h-4 w-4" })}</div>}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {iconNames.map(iconName => {
                                const Icon = iconMap[iconName];
                                return <SelectItem key={iconName} value={iconName}><Icon className="h-4 w-4" /></SelectItem>
                              })}
                            </SelectContent>
                           </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`tasks.${index}.text`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl><Input placeholder={`Task ${index + 1}`} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name={`tasks.${index}.target`}
                        render={({field}) => (
                          <FormItem className="w-20">
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ text: '', icon: 'Feather', target: 1 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>
            
            <FormField
              control={form.control}
              name="motivation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why I want this reward (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="This will help you stay focused on your goal..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
               <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Mission</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
