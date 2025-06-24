import { DEFAULT_PAGE } from '@/constants'
import { parseAsString,parseAsInteger,useQueryStates,parseAsStringEnum } from 'nuqs'
import { MeetingStatus } from '../types'

export const useMeetingsFilter = () => {
    return useQueryStates({
        search: parseAsString.withDefault('').withOptions({clearOnDefault: true}),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault: true}),
        status: parseAsStringEnum(Object.values(MeetingStatus)),
        agentId: parseAsString.withDefault('').withOptions({clearOnDefault: true})

    })
}


// we have made the hook that is respsonsible for managing the state of the filters as it contains the search and page number made by the useQueryStates hook