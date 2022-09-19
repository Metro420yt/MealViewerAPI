declare module "mealviewerapi";

interface MenuTypes {
  breakfast?: string[];
  lunch?: string[];
  supper?: string[];
  snack?: string[];
}

type ReturnTypes = 'raw' | 'url' | 'apiUrl' | 'date'
interface Options {
  return?: ReturnTypes[] | ReturnTypes
  daily?: boolean;
  dailyInterval?: number;
}

interface Dates {
  start?: string | number;
  end?: string | number;
}

interface Response {
  raw?: object;
  url?: string;
  apiURL?: string;
}

interface GetResponseMenus extends MenuTypes {
  date?: string
}

interface GetResponse extends Response {
  menu: GetResponseMenus[];
}

interface EventResponse extends Response {
  menu: MenuTypes;
  date?: string;
}

type EventTypes = 'newMenu' | 'check'


export class Client {
  constructor(school: string, options?: Options);

  /**
    * @example const {Client} = require('mealviewerapi')
    * const mv = new Client('mySchool')
    * mv.get()
    * mv.get(1646666562)
    * mv.get('5/16/2022')
    * mv.get({start: 1646666562, end: 1646666562})
   */
  public get(
    date?: string | number | Dates,
    config?: { dailyResponse: boolean }
  ): Promise<GetResponse>;

  public daily: {
    /**
    * @example const {Client} = require('mealviewerapi')
    * const mv = new Client('mySchool')
    * mv.daily.on('newMenu', data => {console.log(data)})
    * mv.daily.on('check', () => {console.log('new check')})
   */
    on(event: EventTypes, listener: Function): void
    on(event: 'newMenu', listener: (data: EventResponse) => void): void
    on(event: 'check', listener: () => void): void
    on(event: 'check', listener: (data: { message: string, timestamp: number }) => void): void
  }

  private _check(): Promise<GetResponse>;
}