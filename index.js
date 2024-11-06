//@ts-check
const { EventEmitter } = require('events')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const urls = {
  api: 'https://api.mealviewer.com/api/v4/school',
  public: 'https://schools.mealviewer.com/school'
}

class Client {
  /**
   * @param {string} school
   * @param {import('./index.d.ts').ConstructorOptions} options
   */
  constructor(school, options = {}) {
    // validates params
    if (!school || school === '<mySchool>') throw new Error("School name must be provided!");
    this._validate(school, 'string', 'school name')
    this.school = school.split(' ').join('')


    // sets up daily check if in options
    if (options?.daily || options?.dailyInterval) {
      if (!options.dailyInterval) options.dailyInterval = 3600000
      else if (options.dailyInterval < 1000) {
        options.dailyInterval = 30000
        console.log('set dailyInterval to 30sec (30000ms)')
      }

      this.daily = new EventEmitter()
      this._check()
      setInterval(async () => await this._check(), options.dailyInterval)
    }
    else this.daily = {
      on: (...args) => { throw new Error('`options.daily` or `options.dailyInterval` is undefined') },
      emit: (...args) => { throw new Error('unable to emit event') }
    }

    //@ts-ignore
    this.options = options

    // formats return values
    if (options.return) {
      if (typeof options.return === 'string') options.return = [options.return]

      /**@type {Partial<Record<import('./index.d.ts').ReturnTypes, boolean>>}*/
      var returnValues = Object.fromEntries(options.return.map(key => [key, true]))
      this.options.return = returnValues
    }

  }

  /**@type {import('./index.d.ts').Options}*/
  options

  /**
    * @param {string | EpochTimeStamp | object} [date] the date or timestamp to use.
    * @param {object} [config] the date or timestamp to use.
    * @example mv.get()
    * mv.get(1646666562)
    * mv.get('5/16/2022')
    * mv.get({start: 1646666562, end: 1646666562})
   **/
  async get(date, config = { dailyResponse: false }) {
    //verifies  data
    if (date) this._validate(date, ['string', 'number', 'object'], 'date')

    //formats date
    if (!date || date === null) date = Date.now();
    if (typeof date !== 'object') {
      date = new Date(date).toISOString().split('T')[0]
      date = `${date}/${date}`;
    }
    else {
      for (const key in date) this._validate(date[key], ['string', 'number'], `${key} date`)
      if (!date.start) date.end = Date.now();
      if (!date.end) date.end = Date.now();

      date.start = new Date(date.start).toISOString().split('T')[0]
      date.end = new Date(date.end).toISOString().split('T')[0]
      date = `${date.start}/${date.end}`;
    }


    //fetches data
    const url = `${urls.api}/${this.school}/${date}`;
    const res = await (await fetch(url).catch(e => { throw new Error(e) })).json();

    //gets menu data from results.
    // this is a mess, just ignore it. it works. hard to explain how
    var respose = {}
    const resposeItems = [];

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

        if (this.options?.return?.date) config?.dailyResponse ? respose.date = blocks.dateInformation.dateFull : menu.date = blocks.dateInformation.dateFull
        resposeItems.push(menu)
      }
      );

    //adds any additional data
    respose.menu = resposeItems.filter(menu => Object.keys(menu).length !== 0);
    if (config.dailyResponse === true) respose.menu = respose.menu[0]

    if (this.options?.return) {
      const r = this.options?.return || {}
      if (r.raw) respose.raw = res;
      if (r.url) respose.url = `${urls.public}/${this.school}`;
      if (r.apiUrl) respose.apiUrl = url;
    }

    if (config?.dailyResponse && !respose.menu) return;
    return respose;
  }

  /**
   * @private
   * checks to see if its a new day, then runs the get function and emits newMenu if theres data
  */
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

  /**
   * @private
   * validates a values type
  */
  _validate(value, types, valueName) {
    if (typeof types === 'string') types = [types]
    if (!types.includes(typeof value)) throw new Error(`Invalid ${valueName || 'type'}\n  Must be ${types.map(t => t.toUpperCase())}`)
  }
}

/**
 * @example const {Client} = require('mealviewerapi')
 * const mv = new Client('mySchool')
 * const mv = new Client('mySchool', {return: ['raw', 'date']})
 */
exports.Client = Client