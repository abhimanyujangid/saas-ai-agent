//  UI Component
import { CommandResponsiveDialog, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface Props {
    open?: boolean;
    setOpen?: (open: boolean) => void; 
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
    return (
        <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
            <CommandInput 
            placeholder="Find a meeting or Agent..."
            />
            <CommandList>
                <CommandItem>Meeting 1</CommandItem>
                <CommandItem>Meeting 2</CommandItem>
                <CommandItem>Meeting 3</CommandItem>
            </CommandList>
        </CommandResponsiveDialog>
    );
};
