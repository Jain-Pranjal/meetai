import { AlertCircleIcon } from "lucide-react";

interface ErrorProps {
    title: string;
    description: string;
}

export function Error({ title, description }: ErrorProps) {
    return (
        <div className="py-4 px-8 flex flex-1 justify-center items-center ">
            <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                <AlertCircleIcon className="h-6 w-6 text-red-500" />
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

        </div>

    );
}