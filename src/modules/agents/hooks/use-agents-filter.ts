import { DEFAULT_PAGE } from '@/constants'
import { parseAsString,parseAsInteger,useQueryStates } from 'nuqs'

export const useAgentsFilter = () => {
    return useQueryStates({
        search: parseAsString.withDefault('').withOptions({clearOnDefault: true}),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault: true}),
    })
}

// nuqs is used to sync the search params with the useState
// we have made the hook that is respsonsible for managing the state of the filters as it contains the search and page number made by the useQueryStates hook

// so basically the concept is that we need to make the use of the same state everywhere 