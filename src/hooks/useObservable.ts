import ko, { Observable } from "knockout";
import { useState, useLayoutEffect } from "react";

function useForceUpdate() {
    const [incr, setIncr] = useState(0);
    return () => setIncr(incr + 1);
}

/**
 * Reads and subscribes to the value of a single observable,
 *  triggering a rerender if the value inside the observable changes
 */
function useObservable<T>(observable: Pick<Observable<T>, "subscribe" | "peek">) {
    const forceUpdate = useForceUpdate();
    // Doing useLayoutEffect so that the subscription happens synchronously with the initial render;
    // eliminates a window in which the observable can go out of sync with the state
    useLayoutEffect(() => {
        const sub = observable.subscribe(forceUpdate);
        return () => sub.dispose();
    }, [observable]);

    const value = observable.peek();
    if (ko.isWriteableObservable(observable)) {
        return [value, (val: T) => observable(val)];
    }
    return [value];
}

export default useObservable;
