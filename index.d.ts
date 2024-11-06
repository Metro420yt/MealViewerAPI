declare module "mealviewerapi";

type MenuTypes = 'breakfast' | 'lunch' | 'supper' | 'snack'

type ReturnTypes = 'raw' | 'url' | 'apiUrl' | 'date'
type ConstructorOptions = Omit<Options, 'return'> & {
  return?: ReturnTypes[] | ReturnTypes
}
interface Options {
  return?: Partial<Record<ReturnTypes, boolean>>
  daily?: boolean;
  dailyInterval?: number;
}

type DateLike = `${number}/${number}/${number}`
interface Dates {
  start?: DateLike;
  end?: DateLike;
}

interface Response {
  raw?: object;
  url?: string;
  apiURL?: string;
}

interface GetResponseMenus extends Partial<Record<MenuTypes, string[]>> {
  date?: string
}

interface GetResponse extends Response {
  menu: GetResponseMenus[];
}

interface EventResponse extends Response {
  menu: Partial<Record<MenuTypes, string[]>>
  date?: string;
}

type EventTypes = 'newMenu' | 'check'


export class Client {
  constructor(school: string, options?: ConstructorOptions);

  /**
    * @example const {Client} = require('mealviewerapi')
    * const mv = new Client('mySchool')
    * mv.get()
    * mv.get(1646666562)
    * mv.get('5/16/2022')
    * mv.get({start: 1646666562, end: 1646666562})
   */
  public get(
    date?: DateLike | Dates,
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
    on(event: 'check', listener: (data: { message: string, timestamp: EpochTimeStamp }) => void): void
  }

  private _check(): Promise<GetResponse>;
}