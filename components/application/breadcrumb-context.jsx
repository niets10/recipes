'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const BreadcrumbContext = createContext(null);

export function BreadcrumbProvider ({ children }) {
    const [pageLabel, setPageLabelState] = useState(null);
    const setPageLabel = useCallback((label) => {
        setPageLabelState(label);
    }, []);

    return (
        <BreadcrumbContext.Provider value={{ pageLabel, setPageLabel }}>
            {children}
        </BreadcrumbContext.Provider>
    );
}

export function useBreadcrumbLabel () {
    const context = useContext(BreadcrumbContext);
    return context ?? { pageLabel: null, setPageLabel: () => {} };
}
