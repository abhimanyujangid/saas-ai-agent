import { Loader2Icon } from "lucide-react";

interface Props {
    title?: string;
    description?: string;
    variant?: "default" | "large";
}

const LoadingState = ({ 
    title, 
    description, 
    variant = "default" 
}: Props) => {
    return (
        <div className="w-full h-full flex items-center justify-center py-8 px-4">
            <div className="flex flex-col items-center justify-center gap-y-8 bg-background rounded-xl p-12 shadow-lg border border-border/10">
                <div className="relative">
                    <div className="absolute -inset-1 rounded-full  animate-pulse" />
                    <Loader2Icon 
                        className={`animate-spin text-primary relative z-10 ${
                            variant === "large" ? "size-12" : "size-8"
                        }`} 
                    />
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-y-2">
                    <h6 className="text-xl font-semibold text-primary">
                        {title || "Loading..."}
                    </h6>
                    <p className="text-muted-foreground max-w-xs">
                        {description || "Please wait while we load the data."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingState;