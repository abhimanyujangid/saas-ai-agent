import EmptyState from "@/components/empty-state";

export const ProcessingState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8 bg-background rounded-lg px-4 py-5 ">
      <EmptyState
        imageSrc="/processing.svg"
        title="Meeting  Completed"
        description="This Meeting has been completed, a summary will be available soon."
      />
    </div>
  );
};
