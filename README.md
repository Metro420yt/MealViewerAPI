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