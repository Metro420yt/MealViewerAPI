const fetch = require('node-fetch')
const { EventEmitter } = require('events')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const urls = {
  api: 'https://api.mealviewer.com/api/v4/school',
  public: 'https://schools.mealviewer.com/school'
}

class Client {
  constructor(school, options = {}) {
    // validates params
    if (!school) throw new Error("School name must be provided!");
    if (typeof school !== 'string') throw new Error('Invalid school name!\n  Must be STRING')
    for (const key in options) if (!['dailyInterval'].includes(key) && typeof options[key] !== 'boolean') throw new Error(`Invalid option value\n  ${key} must be a boolean`)

    this.school = school.split(' ').join('')

    // sets up daily check if in options
    if (options?.daily || options?.dailyInterval) {
      if (!options.dailyInterval) options.dailyInterval = 3600000
      else if (options.dailyInterval < 1000) {
        options.dailyInterval = 30000
        console.log('set dailyInterval to 30sec (30000ms)')
      }

      const ev = new EventEmitter()
      this.daily = ev

      this._check()
      setInterval(async () => await this._check(), this.options.dailyInterval)
    }
    else this.daily = {
      on: (...args) => {
        throw new Error('`options.daily` and `options.dailyInterval` is undefined')
      }
    }

    this.options = options
  }

  /**
    * @param {string | number | object} [date] the date or timestamp to use.
    * @param {object} [config] the date or timestamp to use.
    * @returns {Promise<{items: object[], date?: string, rawData?: object, url?: string}> | Error}
    * @example mv.get()
    * mv.get(1646666562)
    * mv.get('5/16/2022')
    * mv.get({start: 1646666562, end: 1646666562})
   **/
  async get(date, config = { dailyResponse: false }) {
    var { school, options } = this

    //verifies  data
    if (date && !['string', 'number', 'object'].includes(typeof date)) throw new Error("Invalid date!\n  Must be STRING, NUMBER or OBJECT");


    //formats date
    if (!date || date === null) date = Date.now();
    if (typeof date !== "object") {
      date = new Date(date).toLocaleDateString().split("/").join("-");
      date = `${date}/${date}`;
    }
    else {
      for (const key in date) if (!['string', 'number'].includes(date[key])) throw new Error(`Invalid ${key} date!\n  Must be a STRING, or NUMBER`)
      if (!date.start) date.end = Date.now();
      if (!date.end) date.end = Date.now();

      date.start = new Date(date.start).toLocaleDateString().split("/").join("-");
      date.end = new Date(date.end).toLocaleDateString().split("/").join("-");
      date = `${date.start}/${date.end}`;
    }


    //fetches data
    const url = `${urls.api}/${school}/${date}`;
    const res = await (await fetch(url).catch(e => { throw new Error(e) })).json();
    const resposeItems = [];

    //gets menu data from results.
    // this is a mess, just ignore it. it works. hard to explain how
    var respose = {}

    res.menuSchedules
      .forEach((blocks) => {
        var menu = {}
        blocks.menuBlocks.forEach((block) => {
          //gets items array
          const items = [];
          block.cafeteriaLineList.data[0].foodItemList.data
            .map((food) => food.item_Name.toLowerCase())
            .forEach((item) => {
              if (!items.includes(item)) items.push(item);
            });

          //adds items to menu
          menu[block.blockName.toLowerCase()] = items;
        })
        //adds date and menu
        if (Object.keys(menu).length === 0) return;
        if (options?.date && config?.dailyResponse === false) menu.date = blocks.dateInformation.dateFull
        else if (options?.date && config?.dailyResponse) respose.date = blocks.dateInformation.dateFull
        resposeItems.push(menu)
      }
      );

    //adds any additional data
    respose.menu = resposeItems.filter(menu => Object.keys(menu).length !== 0);
    if (config.dailyResponse === true) respose.menu = respose.menu[0]
    if (options?.rawData) respose.rawData = res;
    if (options?.url) respose.url = `${urls.public}/${this.school}`;
    if (options?.apiURL) respose.apiURL = url;

    if (config.dailyResponse && respose.menu) return respose;
    else if (config?.dailyResponse === false) return respose;
  }

  async _check() {
    this.daily.emit('check', { message: `checked for new menu`, timestamp: Date.now() })
    const file = `${__dirname}\\lastRan.txt`
    const today = new Date(Date.now()).toLocaleDateString()

    if (!existsSync(file) || today !== readFileSync(file, 'utf8')) {
      const data = (await this.get(undefined, { dailyResponse: true }))

      if (data !== undefined) this.daily.emit('newMenu', data)
      writeFileSync(file, today)
    }
  }
}

/**
 * @param {string} school the school to use.
 * @param {{rawData?: boolean, url?:boolean, date?: boolean, dailyInterval?: number}} [options] rawData: returns the response data, url: returns the api url, date: returns the date used, dailyInterval: time between checks in ms
 * @example const api = require('mealviewerapi')
 * const mv = new api('mySchool')
 * const mv = new api('mySchool', {rawData: true, date: true})
 */
exports.Client = Client