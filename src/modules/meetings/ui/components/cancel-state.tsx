import EmptyState from "@/components/empty-state";

export const CancelState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8 bg-background rounded-lg px-4 py-5 ">
      <EmptyState
        imageSrc="/cancelled.svg"
        title="Meeting  Cancelled"
        description="This Meeting has been cancelled."
      />
    </div>
  );
};
