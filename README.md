> [!WARNING]
> No longer maintained

A lightweight wrapper for the [MealViewer](https://mealviewer.com/) API

Checkout the [examples](/examples) for ideas<br>
Submit your own ideas by creating a pull request

<br>

## Finding your school
Find your school by going to [MealViewer](https://schools.mealviewer.com/) and search for your school.

The url will look like **https://schools.mealviewer.com/school/{YourSchool}**. take {YourSchool}, and put it in the Client constructor.
<br><br>

## Changelog
#### v2.0
- Refactored return object again

``` diff
+ {menu: [{lunch?: {}, etc...}], url?, date?, rawData?}
- {items: [{lunch?: {}, etc...}], url?, date?, rawData?}
```
<br>

- Changed urls
``` diff
+ response.url    => https://schools.mealviewer.com/school/{YourSchool}
- response.url    => https://api.mealviewer.com/api/v4/school/{YourSchool}

+ response.apiURL => https://api.mealviewer.com/api/v4/school/{YourSchool}
```
<br>

- Now using class

``` diff
+ new mv.Client(school, options?).get(date?)
- mv.get(school, date?, options?)
```
<br>

- Daily checking event

``` diff
+ client.daily.on('newMenu', data => {})
```
<br>

- New return array/string to make it clearer what will be returned

``` diff
+ new Client('mySchool', {return: ['date', 'url']})
- new Client('mySchool', {date?, url?})
```
<br>

- More return options

``` diff
+ apiUrl, rawData
```

<br>

- Added menu types for intellisense
- node-fetch dependancy is now set to v2 instead of ^v2
  - mealviewerapi is a CJS project, while node-fetch v3 is an ESM file making v3 unusable with CJS files
- [Code Examples](/examples)

#### v1.5
- get function now accepts start and end date

``` diff
+ mv.get(school, {start?, end?})
```


- refactored return object

``` diff
+ {items: [{lunch?: {}}, etc...], url?, date?, rawData?}
- {lunch?: {}, url?, date?, rawData?}
```
