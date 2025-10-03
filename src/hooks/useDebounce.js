import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value.
 * It will only update the returned value after a specified delay has passed
 * without the original value changing.
 *
 * @param {any} value The value to debounce.
 * @param {number} delay The debounce delay in milliseconds.
 * @returns {any} The debounced value.
 */
export default function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function: This will be called if the value or delay changes
        // before the timer has finished. It clears the old timer.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-run the effect if value or delay changes

    return debouncedValue;
}
