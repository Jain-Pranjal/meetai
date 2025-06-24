// taken from shadcn
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AgentGetMany } from "../../types";
import { generatedAvatar } from "@/components/generated-avatar";
import { CornerDownRightIcon, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<AgentGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          {generatedAvatar({
            seed: row.original.name || "User",
            variant: "botttsNeutral",
            className: "border size-8",
          })}
          <span className="capitalize font-semibold">{row.original.name}</span>
        </div>

        <div className="flex items-center gap-x-2">
          <CornerDownRightIcon className="size-3 text-muted-foreground" />
          <span className="text-sm text-muted-foreground truncate capitalize max-w-[200px]">
            {row.original.instructions || "No instructions provided."}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "meetingCount",
    header: "Meeting Count",
    cell: ({ row }) => (
      <Badge className="text-xs flex items-center gap-x-2 [&>svg]:size-4">
        <VideoIcon />
        {row.original.meetingCount}
        {row.original.meetingCount === 1 ? " meeting" : " meetings"}
      </Badge>
    ),
  },
];


// You can access the row data using row.original in the cell function.