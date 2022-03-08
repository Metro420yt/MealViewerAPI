const fetch = require("node-fetch");
const error = (msg) => {
  throw new Error(msg);
};

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
  if (!school) error("School name must be provided!");
  if (typeof school !== "string") error("Invalid school name!\n  Must be STRING");

  if (
    date &&
    (typeof date !== "string" ||
      typeof date !== "number" ||
      typeof date === "object")
  )
    error("Invalid date!\n  Must be STRING, NUMBER or OBJECT");

  //formats date
  if (!date || date === null) date = Date.now();
  date = new Date(date).toLocaleDateString().split("/").join("-");
  if (typeof date === "string" || typeof date === "number")
    date = `${date}/${date}`;
  else {
    //not sure if this works yet, cant test it right now
    if (
      typeof date.start !== "string" ||
      typeof date.start !== "number" ||
      typeof date.end !== "string" ||
      typeof date.end !== "number"
    ) error("Invalid end/start date!\n  Must be a STRING, or NUMBER");

    if (!date.start) date.end = Date.now();
    if (!date.end) date.end = Date.now();

    date.start = new Date(date.start).toLocaleDateString().split("/").join("-");
    date.end = new Date(date.end).toLocaleDateString().split("/").join("-");
    date = `${date.start}/${date.end}`;
  }

  //fetches data
  const url = `${baseURL}/${school}/${date}`;
  const res = await (await fetch(url).catch(error)).json();
  var respose = {};

  //gets menu data from results
  res.menuSchedules
    .map((data) => data.menuBlocks)
    .forEach((blocks) =>
      blocks.forEach((block) => {
        //gets items array
        const items = [];
        block.cafeteriaLineList.data[0].foodItemList.data
          .map((food) => food.item_Name.toLowerCase())
          .forEach((item) => {
            if (!items.includes(item)) items.push(item);
          });

        //adds data to respons var
        respose[block.blockName.toLowerCase()] = items;
      })
    );

  //adds any additional data
  if (options?.rawData) respose.rawData = res;
  if (options?.url) respose.url = url;
  if (options?.date) respose.date = date;

  return respose;
};