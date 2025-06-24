import { EmptyState } from "@/components/EmptyState";

export const CancelledState = () => {
  return (
    <div className="bg-white rounded-lg flex flex-col items-center justify-center px-4 py-5">
      <EmptyState
        title="Meeting is Cancelled"
        description="This meeting has been cancelled"
        image="/cancelled.svg"
      />
    </div>
  );
}