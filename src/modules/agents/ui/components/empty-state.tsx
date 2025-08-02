import { AlertCircleIcon, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

interface Props {
    title?: string;
    description?: string;
    variant?: "default" | "large";
    icon?: "error" | "empty" | "custom";
    customIcon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
}

const EmptyState = ({ 
    title, 
    description
}: Props) => {
    return (
        <div className="flex flex-col items-center justify-center gap-y-8 
            bg-background rounded-xl p-8 shadow-lg border border-border/10">
            <div className="relative">
                <div className="absolute -inset-1 bg-muted rounded-full opacity-50" />
                <Image
                    src="/empty.svg"
                    alt="Empty State"
                    width={160}
                    height={160}
                    className="relative"
                />
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-y-2">
                <h6 className="text-xl font-semibold">
                    {title || "Nothing here yet"}
                </h6>
                <p className="text-muted-foreground max-w-sm">
                    {description || "Get started by creating your first item."}
                </p>
            </div>
        </div>
    );
};

export default EmptyState;