import { createContext } from 'react';

export const FilterContext = createContext(null);
export const FilterDispatchContext = createContext(null);

export function filterReducer(filters, action) {
    return { ...filters, ...action };
}
