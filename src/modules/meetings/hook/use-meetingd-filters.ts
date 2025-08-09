import { DEFAULT_PAGE } from '@/constants/constants';
import {
  parseAsString,
  parseAsInteger,
  useQueryStates,
  parseAsStringEnum
} from 'nuqs'

import { MeetingStatus } from '../types';


export const useMeetingFilters = () => {
return useQueryStates({
    search : parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum(Object.values(MeetingStatus)).withOptions({ clearOnDefault: true }),
    agentId: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
});
};
