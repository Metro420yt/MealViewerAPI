# Currently testing dev branch
# Main release soon

A lightweight wrapper for the [MealViewer](https://mealviewer.com/) API

checkout the [examples](/examples) for ideas<br>
submit your own ideas by creating a pull request

<br>

## Finding your school
find your school by going to [MealViewer](https://schools.mealviewer.com/) and search for your school.

the url will look like **https://schools.mealviewer.com/school/{YourSchool}**. take {YourSchool}, and put it in the Client constructor.

flexible to show any listed menu type.
<br><br>

## Changelog
#### v2.0
- refactored return object again

```
+ {menu: [{lunch?: {}, etc...}], url?, date?, rawData?}
- {items: [{lunch?: {}, etc...}], url?, date?, rawData?}
```
<br>

- added menu types for intellisense
- changed urls

```
+ response.url    => https://schools.mealviewer.com/school/{YourSchool}
- response.url    => https://api.mealviewer.com/api/v4/school/{YourSchool}

+ response.apiURL => https://api.mealviewer.com/api/v4/school/{YourSchool}
```
<br>

- Now using classes with constructor

```
+ new mv.Client(school, options?).get(date?)
- mv.get(school, date?, options?)
```
<br>

- New daily checking event

```
+ mv.daily.on('newDay', data => {})
```

<br>

- node-fetch dependancy is now set to v2 instead of ^v2
 - mealviewerapi is a CJS file, while node-fetch v3 is an ESM file making v3 unusable with CJS files

#### v1.5
- get function now accepts start and end date

```
+ mv.get(school, {start?, end?})
```


- refactored return object

```
+ {items: [{lunch?: {}}, etc...], url?, date?, rawData?}
- {lunch?: {}, url?, date?, rawData?}
```
