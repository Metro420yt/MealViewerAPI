declare module "mealviewerapi";

interface menuTypes {
  breakfast?: string[];
  lunch?: string[];
  supper?: string[];
  snack?: string[];
}

interface optionsObject {
  rawData?: boolean;
  url?: boolean;
  apiURL?: boolean;
  date?: boolean;
  daily?: boolean;
  dailyInterval?: number;
}

interface dateObject {
  start?: string | number;
  end?: string | number;
}

interface response extends menuTypes {
  date?: string
}

interface getResponse {
  menu: response[];
  rawData?: object;
  url?: string;
  apiURL?: string;
}

interface dailyResponse {
  menu: menuTypes;
  date?: string;
  rawData?: object;
  url?: string;
  apiURL?: string;
}


export class Client {
  constructor(school: string, options?: optionsObject);

  /**
    * @example const {Client} = require('mealviewerapi')
    * const mv = new Client('mySchool')
    * mv.get()
    * mv.get(1646666562)
    * mv.get('5/16/2022')
    * mv.get({start: 1646666562, end: 1646666562})
   */
  public get(
    date?: string | number | dateObject,
    config?: { dailyResponse: boolean }
  ): Promise<getResponse> | Error;

  public daily: {
    /**
    * @example const {Client} = require('mealviewerapi')
    * const mv = new Client('mySchool')
    * mv.daily.on('newMenu', data => {console.log(data)})
    * mv.daily.on('check', () => {console.log('new check')})
   */
    on(event: string, listener: Function): void
    on(event: 'newMenu', listener: (data: dailyResponse) => void): void
    on(event: 'check', listener: () => void): void
    on(event: 'check', listener: (data: { message: string, timestamp: number }) => void): void
  }

  private _check(): Promise<getResponse> | Error;
}