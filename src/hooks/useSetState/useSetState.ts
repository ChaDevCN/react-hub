import { useRef, useState } from "react";

export const useSetState = <T extends object>(initialState: T) => {
    const [state, _setState] = useState<T>(initialState);
    const stateRef = useRef(initialState);
    
    const setRefState = (patch: T | ((prev: T) => T)) => {
        if (typeof patch === 'function') {
            stateRef.current = patch(stateRef.current);
        } else {
            stateRef.current = patch;
        }
        _setState(stateRef.current);
    }
    const getRefState = () => stateRef.current;
    return { state, setRefState, getRefState };
}