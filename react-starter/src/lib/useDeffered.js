import { useRef, useReducer } from'react';

function useDeffered(state, time) {
    const tick = useReducer((state) => state + 1, 0);
    const timeout = useRef();
    const defferedState = useRef();

    if (!timeout.current) {
        timeout.current = setTimeout(() => {
            defferedState.current = state;
        }, time);
    }

}