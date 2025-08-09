import { ReactNode, useState } from "react";

// Icons
import { ChevronsUpDownIcon } from "lucide-react";


import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandList,
    CommandResponsiveDialog
    } from "@/components/ui/command";
import { CommandItem } from "cmdk";


    interface Props {
        option: Array<{
            id: string;
            value: string;
            children?: ReactNode;
        }>
        onSelect: (value: string) => void;
        onSearch: (query: string) => void;
        value?: string;
        placeholder?: string;
        isSearchable?: boolean;
        className?: string;
    }

export const CommandSelect = ({
    option,
    onSelect,
    onSearch,
    value,
    placeholder = "Select an option",
    isSearchable = true,
    className,  
}: Props) => {
    const [open, setOpen] = useState(false);
    const selectedOption = option.find((opt) => opt.value === value);

    const handleClose = (value: boolean) => {
        onSearch?.("");
        setOpen(value);
    }

    return (
        <>
        <Button
        onClick={() => setOpen(true)}
        type="button"
        variant="outline"
        className={cn("w-full justify-between font-normal px-2", !selectedOption && "text-muted-foreground", className)}>
            <div>
                {
                    selectedOption?.children ?? placeholder   
                }
            </div>
            <ChevronsUpDownIcon />
        </Button>
        <CommandResponsiveDialog open={open} onOpenChange={handleClose} shouldFilter={!onSearch}>
                <CommandInput onValueChange={onSearch} placeholder="Search..." />
                <CommandList>
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            No options found.
                        </span>
                    </CommandEmpty>
                    {option.map((opt) => (
                        <CommandItem
                            key={opt.id}
                            value={opt.value}
                            onSelect={() => {
                                onSelect(opt.value);
                                setOpen(false);
                            }}
                            className="cursor-pointer"
                        >
                            {opt.children ?? opt.value}
                        </CommandItem>
                    ))}
                </CommandList>
        </CommandResponsiveDialog>
        </>
    )
};