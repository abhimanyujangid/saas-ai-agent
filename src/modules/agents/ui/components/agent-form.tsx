'use client';

import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types
import { AgentGetOne } from "../../types";

// Zod schema
import { useForm } from "react-hook-form";
import { agentInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

// UI components
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AgentFormProps {
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isEdit = !!initialValues?.id;

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );

        if(initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id }),
          )
        }

        onSuccess?.(data);
      },
      onError: (error) => {
       toast.error(error.message)

        // Todo : check if error code is 'Forbidden' and redirect to upgrade page

        
      },
    })
  );

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );

        // Invalidate for free tire usage
        onSuccess?.(data);
      },
      onError: (error) => {
       toast.error(error.message)
        // Todo : check if error code is 'Forbidden' and redirect to upgrade page
      },
    })
  );

  const form = useForm<z.infer<typeof agentInsertSchema>>({
    resolver: zodResolver(agentInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instruction ?? "",
    },
  });

  const isPending = createAgent.isPending || updateAgent.isPending;

  const onSubmit = (value: z.infer<typeof agentInsertSchema>) => {
    if (isEdit) {
      // TODO: Add update mutation here
      updateAgent.mutate({ id: initialValues!.id, ...value });
    } else {
      createAgent.mutate(value);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <GeneratedAvatar
          seed={form.watch("name") || "New Agent"}
          variant="bottts"
          className="border size-16"
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter agent name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} placeholder="You are a helpful math assistant that can answer questions and help with assignments  ." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between  gap-4">
          <Button type="submit" disabled={isPending}>
            {isEdit ? "Update Agent" : "Create Agent"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
