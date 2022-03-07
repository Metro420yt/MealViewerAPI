declare module 'mealviewerapi';

interface options {
    rawData?: boolean,
    url?: boolean,
    date?: boolean
}

export function get(
    school: string,
    date?: string | number,
    options?: options
): Promise<object> | Error;