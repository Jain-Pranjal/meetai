import { EmptyState } from "@/components/EmptyState";

export const ProcessingState = () => {
  return (
    <div className="bg-white rounded-lg flex flex-col items-center justify-center px-4 py-5">
      <EmptyState
        title="Meeting Completed"
        description="The meeting was completed, a summary willl appear soon"
        image="/processing.svg"
      />

    </div>
  );
}