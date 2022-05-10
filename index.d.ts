declare module "mealviewerapi";

interface optionsObject {
  rawData?: boolean;
  url?: boolean;
  date?: boolean;
  dailyInterval?: number;
}

interface dateObject {
  start?: boolean;
  end?: boolean;
}

interface getResponse {
  items: object[],
  date?: string,
  rawData?: object,
  url?: string
}

interface dailyResponse {
  items: object[],
  date?: string,
  rawData?: object,
  url?: string
}


export class Client {
  constructor(school: string, options:optionsObject);

  public get(
    date?: string | number | dateObject,
    options?: optionsObject
  ): Promise<getResponse> | Error;

  public daily: {
    on(event: 'check', listener:()=>void): this
    on(event: 'newDay', listener:(data:getResponse) => void): this
  }

  private async _check (): Promise<getResponse> | Error;
}