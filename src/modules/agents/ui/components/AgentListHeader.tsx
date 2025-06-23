"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialog } from "./NewAgentDialog";
import { useAgentsFilter } from "../../hooks/use-agents-filter";
import { AgentsSearchFilter } from "./AgentsSearchFilter";
import { DEFAULT_PAGE } from "@/constants";




export const AgentListHeader = () => {
  const [open,onOpenChange] = React.useState(false);
  const [filters, setFilters] =useAgentsFilter();

  const isAnyFilterModified=!!filters.search;

  const onClearFilters = () => {
    setFilters({
      search: "",
      page:DEFAULT_PAGE,
    });
  };



  return (
    <>
      <NewAgentDialog open={open} onOpenChange={onOpenChange} />
       
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Agents</h5>
          <Button onClick={() => onOpenChange(true)}>
            <PlusIcon /> Create Agent
          </Button>
        </div>

        <div className="flex items-center gap-x-2 p-1">
          <AgentsSearchFilter /> 
          {isAnyFilterModified && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
            >
              <XCircleIcon /> Clear
            </Button>
          )}

        </div>
    </div>
    </>
  );
}