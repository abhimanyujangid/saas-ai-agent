// Import React and necessary hooks
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/router";
import {  useQueryClient } from "@tanstack/react-query";


// Importing types
import { AgentGetOne } from "../../types";


interface AgentFormProps {
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
};


export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {

  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return (
    <form>
      {/* Form fields go here */}
      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};
