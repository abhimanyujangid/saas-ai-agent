import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

export const DataPagination = ({
  page,
  totalPages,
  onChangePage,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={page <= 1}
          onClick={() => onChangePage(Math.max(page - 1, 1))}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          disabled={page >= totalPages || totalPages === 0}
          onClick={() => onChangePage(Math.min(page + 1, totalPages))}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
