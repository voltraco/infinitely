# SYNOPSIS
Infinite scrolling component that works with _any_ DOM structure and loads content lazily.


# BUILD STATUS

[![Development sponsored by voltra.co](https://img.shields.io/badge/Development%20sponsored%20by-Voltra.co-yellow.svg)](https://voltra.co/)
[![build status](https://secure.travis-ci.org/juliangruber/unendlich.svg)](http://travis-ci.org/juliangruber/unendlich)

# USAGE

There needs to be an outer and an inner element, the outer element having

- a fixed height
- overflow auto
- position relative

The rest is up to you:

```js
const Infinitely = require('unendlich')

const rows = []
for (let i = 0; i < 1e5; i++) {
  rows.push({
    foo: String(new Date()),
    bar: 'beep',
    beep: Math.random().toString(16).slice(2)
  })
}

const inner = `<div></div>`
const outer = `<ul style="height: 800px; width: 600px; overflow: auto">${inner}</ul>`
document.body.appendChild(outer)

const example = new Infinitely({
  rows,
  inner,
  outer,
  render: row => `<li>${row.foo}: ${row.bar} (${row.beep})</li>`,
  page: 100,
  padding: 50
})
```

A row element can also by an `async` function, which will then be resolved before rendering:

```js
const rows = [
  async () => fetch(url)
]
```

## Installation

```bash
$ npm install unendlich
```


# API

## CONSTRUCTOR

```js
new Infinitely({
  rows,
  inner,
  outer,
  render,
  update,
  page = 100,
  padding = 50,
  rowHeight,
  debug = false
})
```

Create a new instance and `.render()` it.

For extra performance, pass `update` which takes existing old row elements and updates them, instead of
creating new ones. For example:

```js
{
  render: row => `<li>${row.foo}: ${row.bar} (${row.beep})</li>`,
  update: (row, el) => el.innerHTML = `${row.foo}: ${row.bar} (${row.beep})`
}
```

## METHODS

#### Infinitely#render({ refresh })

Force a render, if `reset` is `true` it will also rerender already rendered rows.

#### Infinitely#setRows(rows)

Update the row content. Doesn't trigger a rerender by itself.

#### Infinitely#setHeight(height, { render = true })

Update the #outer element's height. Example: `unendlich.setHeight('200px')`.
