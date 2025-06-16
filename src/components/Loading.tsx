import { Loader2Icon } from "lucide-react";

interface LoadingProps {
    title: string;
    description: string;
}

export function Loading({ title, description }: LoadingProps) {
    return (
        <div className="py-4 px-8 flex flex-1 justify-center items-center ">
            <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                <Loader2Icon className="animate-spin h-6 w-6 text-primary" />
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

        </div>

    );
}