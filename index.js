const fetch = require("node-fetch");

/**
 * @param {string} school the school to return.
 * @param {string | number | object} [date] the date or timestamp to use.
 * @param {{rawData?: boolean, url?:boolean, date?: boolean}} [options] rawData: returns the response data, url: returns the api url, date: returns the date used
 * @returns {Promise<object> | Error}
 * @example api.get('mySchool')
 * api.get('mySchool', 1646666562)
 * api.get('mySchool', null, {rawData: true, url: true})
 */
exports.get = async (school, date, options) => {
  const baseURL = "https://api.mealviewer.com/api/v4/school";

  //verifies  data
  if (!school) throw new Error("School name must be provided!");
  if (typeof school !== "string") throw new Error("Invalid school name!\n  Must be STRING");

  if (date && (
    typeof date !== "string" &&
    typeof date !== "number" &&
    typeof date !== "object")
  ) throw new Error("Invalid date!\n  Must be STRING, NUMBER or OBJECT");

  //formats date
  if (!date || date === null) date = Date.now();

  if (typeof date !== "object") {
    date = new Date(date).toLocaleDateString().split("/").join("-");
    date = `${date}/${date}`;
  }
  else {
    if (
      typeof date.start !== "string" &&
      typeof date.start !== "number" &&
      typeof date.end !== "string" &&
      typeof date.end !== "number"
    ) throw new Error("Invalid end/start date!\n  Must be a STRING, or NUMBER");

    if (!date.start) date.end = Date.now();
    if (!date.end) date.end = Date.now();

    date.start = new Date(date.start).toLocaleDateString().split("/").join("-");
    date.end = new Date(date.end).toLocaleDateString().split("/").join("-");
    date = `${date.start}/${date.end}`;
  }

  //fetches data
  const url = `${baseURL}/${school}/${date}`;
  const res = await (await fetch(url).catch(e => { throw new Error(e) })).json();
  
  const resposeItems = [];

  //gets menu data from results
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
      if (options?.date && Object.keys(menu).length !== 0) menu.date = blocks.dateInformation.dateFull
      resposeItems.push(menu)
    }
    );

  //adds any additional data
  var respose = {items: resposeItems.filter(menu=>Object.keys(menu).length !== 0)};
  if (options?.rawData) respose.rawData = res;
  if (options?.url) respose.url = url;

  return respose;
};