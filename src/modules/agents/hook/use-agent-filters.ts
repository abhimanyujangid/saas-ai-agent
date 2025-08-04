import { DEFAULT_PAGE } from '@/constants/constants';
import {
  parseAsString,
  parseAsInteger,
  useQueryStates,
} from 'nuqs'


export const useAgentFilters = () => {
return useQueryStates({
    search : parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
})
};
