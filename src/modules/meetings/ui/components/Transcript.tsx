import Highlighter from "react-highlight-words";
import { useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { generatedAvatarURI } from "@/lib/avatar";

interface Props {
  meetingId: string;
}

export const Transcript = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.meetings.getTranscript.queryOptions({ //giving res in array format
      id: meetingId,
    })
  );

  // Filtering the data based on the search query
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = (data ?? []).filter((item) => {
    return item.text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex bg-white rounded-lg border px-4 py-5 flex-col gap-y-4 w-full">
      <p className="text-sm font-medium">Transcript</p>
      <div className="relative">
        <Input
          placeholder="Search transcript..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-7 h-9 w-[240px]"
        />
        <SearchIcon className="absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground size-4" />
      </div>

      <ScrollArea className="h-[400px]">
        <div className="flex flex-col gap-y-4 ">
          {filteredData.map((item) => {
            return (
              <div
                className="flex flex-col gap-y-2 hover:bg-muted rounded-md border"
                key={item.start_ts}
              >
                <div className="flex gap-x-2 items-center">
                  <Avatar className="size-6">
                    <AvatarImage
                      src={
                        item.user.image ??
                        generatedAvatarURI({
                          seed: item.user.name,
                          variant: "initials",
                        })
                      }
                      alt="User Avatar"
                    />
                  </Avatar>
                  <p className="text-sm  font-medium">{item.user.name}</p>
                  <p className="text-xs text-blue-500 font-medium">
                    {format(new Date(0, 0, 0, 0, 0, 0, item.start_ts), "mm:ss")}
                  </p>
                </div>

                  <Highlighter
                    className="text-sm text-neutral-700"
                    highlightClassName="bg-yellow-200"
                    searchWords={[searchQuery]} //accepts array of strings
                    autoEscape={true}
                    textToHighlight={item.text}
                  />

              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
