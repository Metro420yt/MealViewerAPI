const fetch = require('node-fetch')
const error = (msg) => {
    console.log(new Error(msg))
    process.exit(1)
}


/**
 * @param {string} school the school to return.
 * @param {string | number} [date] the date or timestamp to use.
 * @param {{rawData?: boolean, url?:boolean}} [options]
 * @returns {Promise<object> | Error}
 */
exports.get = async (school, date, options) => {
    const baseURL = 'https://api.mealviewer.com/api/v4/school'
    if (!school) error('School name must be provided!');
    if (typeof school !== 'string') error('Invalid school name!\n  Must be STRING');
    if (date && (typeof date !== 'string' || typeof date !== 'number')) error('Invalid date!\n  Must be STRING or NUMBER');

    //formats date
    if (!date) date = Date.now();
    date = new Date(date)
        .toLocaleDateString()
        .split('/')
        .join('-')

    //fetches data
    const url = `${baseURL}/${school}/${date}/${date}`
    const res = await (await fetch(url).catch(error)).json()
    var respose = {}

    //gets menu data from results
    res.menuSchedules.map(data => data.menuBlocks)
        .forEach(blocks => blocks.forEach(block => {
            const items = [];
            block.cafeteriaLineList.data[0].foodItemList.data.map(food => food.item_Name.toLowerCase()).forEach(item => {
                if (!items.includes(item)) items.push(item)
            })

            //adds data to respons var
            respose[block.blockName.toLowerCase()] = items
        }));

    //adds any additional data
    if (options?.rawData) respose.rawData = res
    if (options?.url) respose.url = url

    return respose
}