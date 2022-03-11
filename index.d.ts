declare module "mealviewerapi";

interface options {
  rawData?: boolean;
  url?: boolean;
  date?: boolean;
}

interface date {
  start?: boolean;
  end?: boolean;
}

interface response {
  items: object[],
  date?: string,
  rawData?: object,
  url?: string
}

export function get(
  school: string,
  date?: string | number,
  options?: options
): Promise<response> | Error;