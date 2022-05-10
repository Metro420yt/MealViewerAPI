# Currently testing dev branch
# Main release soon
<br>
<br>

A lightweight wrapper for the [MealViewer](https://mealviewer.com/) API

## Finding your school
find your school by going to [MealViewer](https://schools.mealviewer.com/) and search for your school.

the url will look like **https://schools.mealviewer.com/school/{YourSchool}**. take {YourSchool}, and put it in the Client constructor.

flexible to show any listed menu type.

## Changelog
#### v2.0
- added menu types for intellisense

- changed url keys

```
> response.url = https://schools.mealviewer.com/school/{YourSchool}

+ response.apiURL = https://api.mealviewer.com/api/v4/school/{YourSchool}
```


- Now using constructor

```
+ new mv(school, options?).get(date?)
- mv.get(school, date?, options?)
```


- Moved to Client export

```
const api = require('mealviewerapi')

+ const mv = new api.Client(school, options?)
+ mv.get(date?)
- api.get(school, date?, options?)
```


- New daily checking event

```
+ mv.daily.on('newDay', data => {})
```


- node-fetch dependancy is now set to v2
 - mealviewerapi is a CJS file, while node-fetch v3 is an ESM file making v3 unusable with CJS files

#### v1.5
- get function now accepts start and end date

```
+ mv.get(school, {start, end})
```


- refactored return object

```
+ {items: [{lunch?: {}}], url?, date?, rawData?}
- {lunch?: {}, url?, date?, rawData?}
```