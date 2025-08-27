import Image from "next/image";

interface Props {
    title?: string;
    description?: string;
    variant?: "default" | "large";
    icon?: "error" | "empty" | "custom";
    customIcon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    imageSrc?: string;
}

const EmptyState = ({ 
    title, 
    description,
    imageSrc = '/empty.svg'
}: Props) => {
    return (
        <div className="flex flex-col items-center justify-center gap-y-8 
            bg-background rounded-xl p-8">
            <div className="relative">
                <div className="absolute -inset-1 bg-muted rounded-full opacity-50" />
                <Image
                    src={imageSrc}
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