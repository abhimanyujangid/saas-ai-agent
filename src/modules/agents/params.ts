import { DEFAULT_PAGE } from '@/constants/constants';
import {
  parseAsString,
  parseAsInteger,
  createLoader,
} from 'nuqs/server'
 

const filterSearchParams = {
    search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
}


export const loadSearchParams = createLoader(filterSearchParams)