import { CircleXIcon,CircleCheckIcon,ClockArrowUpIcon,VideoIcon,LoaderIcon } from "lucide-react";
import { MeetingStatus } from "../../types";
import { CommandSelect } from "@/components/CommandSelect";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";


const options=[
    {
        id:MeetingStatus.Upcoming,
        value:MeetingStatus.Upcoming,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <ClockArrowUpIcon />{MeetingStatus.Upcoming}
            </div>
        )
    },
    {
        id:MeetingStatus.Active,
        value:MeetingStatus.Active,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <VideoIcon />{MeetingStatus.Active}
            </div>
        )
    },
    {
        id:MeetingStatus.Completed,
        value:MeetingStatus.Completed,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <CircleCheckIcon />{MeetingStatus.Completed}
            </div>
        )
    },
    {
        id:MeetingStatus.Cancelled,
        value:MeetingStatus.Cancelled,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <CircleXIcon />{MeetingStatus.Cancelled}
            </div>
        )
    },
    {
        id:MeetingStatus.Processing,
        value:MeetingStatus.Processing,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <LoaderIcon />{MeetingStatus.Processing}
            </div>
        )
    },
]


export const StatusFilter = () => {
    const [filter, setFilter] = useMeetingsFilter();

    return (
        <CommandSelect
        placeholder="Status"
            className="h-9"
            value={filter.status??""}
            onSelect={(value) => setFilter({status:value as MeetingStatus})}
            options={options}
        />
    )
}

// here we have used the onSelect as the data to be searched is already available in the options