declare module 'mealviewerapi';

interface options {
    rawData?: boolean,
    url?: boolean,
    date?: boolean
}

interface date {
    start?: boolean,
    end?: boolean
}

export function get(
    school: string,
    date?: string | number,
    options?: options
): Promise<object> | Error;