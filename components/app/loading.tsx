import { LoadingSpinner } from "@/components/Feedback/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <LoadingSpinner label="Loading" />
    </div>
  );
}
