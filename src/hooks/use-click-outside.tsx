import { useEffect, type RefObject } from 'react';

type Callback = (event: MouseEvent | TouchEvent) => void;

const useClickOutside = <T extends HTMLElement>(
    ref: RefObject<T>,
    callback: Callback
): void => {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent | TouchEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback(event);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [ref, callback]);
};

export default useClickOutside;
