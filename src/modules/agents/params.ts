// taken from doc
// here we are accessing the and making the params on server side

import { DEFAULT_PAGE } from '@/constants'
import { parseAsString,parseAsInteger, createLoader } from 'nuqs/server'

export const filterSearchParams =  {
        search: parseAsString.withDefault('').withOptions({clearOnDefault: true}),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault: true}),

}

export const loadSearchParams = createLoader(filterSearchParams)


// we are making the server side to sync with the client side so that we can use the same params in the client side and server side