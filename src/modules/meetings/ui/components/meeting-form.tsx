'use client';

import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


// Zod schema
import { useForm } from "react-hook-form";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

// Schemas And Types
import { MeetingGetOne } from "../../types";
import { meetingInsertSchema } from "../../schemas";
import { useState } from "react";

interface MeetingFormProps {
  onSuccess?: (id: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne | null;
}

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [openNewAgentDialog, setOpenNewAgentDialog] = useState<boolean>(false);

  const [agentSearch, setAgentSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const agent = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );

        if(initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
          )
        }

        onSuccess?.(data.id);
      },
      onError: (error) => {
       toast.error(error.message)

        // Todo : check if error code is 'Forbidden' and redirect to upgrade page

        
      },
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );

        if(initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
          )
        }

        // Invalidate for free tire usage
        onSuccess?.(data.id);
      },
      onError: (error) => {
       toast.error(error.message)
        // Todo : check if error code is 'Forbidden' and redirect to upgrade page
      },
    })
  );

  const form = useForm<z.infer<typeof meetingInsertSchema>>({
    resolver: zodResolver(meetingInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isPending = createMeeting.isPending || updateMeeting.isPending;
  const isEdit = !!initialValues?.id;

  const onSubmit = (value: z.infer<typeof meetingInsertSchema>) => {
    if (isEdit) {
      // TODO: Add update mutation here
      updateMeeting.mutate({ id: initialValues!.id, ...value });
    } else {
      createMeeting.mutate(value);
    }
  };

  return (
  <>
  <NewAgentDialog
    open={openNewAgentDialog}
    openChange={setOpenNewAgentDialog}
  />
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Math Assistant" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
              <FormControl>
               <CommandSelect
               option={(agent.data?.items ?? []).map((agent) => ({
                 id: agent.id,
                 value: agent.id,
                 children: (
                   <div className="flex items-center gap-x-2">
                     <GeneratedAvatar
                       seed={agent.name ?? ""}
                       variant="bottts"
                       className="size-6"
                     />
                     <span>{agent.name}</span>
                   </div>
                 ),
                 }))} 
                onSelect={(value) => field.onChange(value)}
                onSearch={setAgentSearch}
                value={field.value}
                placeholder="Select an agent"
               />  
              </FormControl>
              <FormDescription>
                Not found what you&apos;re looking for?{" "}
                <Button
                  variant="link"
                  type="button"
                  className="p-0"
                  onClick={() => setOpenNewAgentDialog(true)}
                >
                  Create a new agent
                </Button>

              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between  gap-4">
          <Button type="submit" disabled={isPending}>
            {isEdit ? "Update Meeting" : "Create Meeting"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  </>
  );
};
