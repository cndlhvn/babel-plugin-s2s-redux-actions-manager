# babel-plugin-s2s-redux-actions-manager

> manage redux actions

Here is the sample repository using this s2s plugin.
[https://github.com/cndlhvn/s2s-redux-actions-sample](https://github.com/cndlhvn/s2s-redux-actions-sample)

## Install

```
$ yarn add --dev babel-plugin-s2s-redux-actions-manager
```

## Dependency

This plugin is dependent on babel-plugin-s2s-action-builders, babel-plugin-s2s-redux-actions and babel-plugin-s2s-redux-actions-root.

Please prepare these plugins before using this plugin.

[https://github.com/cndlhvn/babel-plugin-s2s-action-builders](https://github.com/cndlhvn/babel-plugin-s2s-action-builders)

[https://github.com/cndlhvn/babel-plugin-s2s-redux-actions](https://github.com/cndlhvn/babel-plugin-s2s-redux-actions)

[https://github.com/cndlhvn/babel-plugin-s2s-redux-actions-root](https://github.com/cndlhvn/babel-plugin-s2s-redux-actions-root)

## s2s.config.js

s2s-redux-actions-manager plugin watch the `src/builders/*.js` files.


```js
module.exports = {
  watch: './**/*.js',
  plugins: [
    {
      test: /src\/actions\/(?!.*index).*\.js/,
      plugin: ['s2s-redux-actions', {autocomplete: false}]
    },
    {
      test: /src\/actions\/(?!.*index).*\.js/,
      output: "index.js",
      plugin: ['s2s-redux-actions-root',
        { input: 'src/actions/*.js', output: "src/actions/index.js" }]
    },
    {
      test: /src\/builders\/.*\.js/,
      plugin: ['s2s-redux-actions-manager',
      { input: 'src/builders/*.js', output: "src/actions/*.js" }]
    }
  ],
  templates: [
    {
      test: /src\/actions\/.*\.js/, input: 'redux-action.js'
    }
  ]
}
```
## Start s2s

Start the s2s with yarn command

```
yarn run s2s
```

## Usage

#### When create a action builder file

When you create a `src/builders/*.js`, s2s creates `src/actions/*.js` as a same name. \
For example, you create a `src/builders/user.js`, then s2s creates a `src/actions/user.js`

#### Write action name

#### In:

In the action builder file, write action name with camelcase such as `searchPokemon` and save it.

`src/builders/pokemon.js`
```js
searchPokemon
```

It will be expanded like this.

#### Out:

`src/builders/pokemon.js`
```js
let searchPokemon;
```

`src/actions/pokemon.js`
```js
export const searchPokemon = createAction("SEARCH_POKEMON");
```

#### Remove action name

If you remove the "action name" written in the `src/builders/*.js` file, "action name" is removed from the file with the same name in `src/actions/`.

# Test

This plugin has two test files. \
First is babel plugin main test file named `test.js` on root directory. \
Next is a `test/index.js` that will be transformed by the plugin.

Run this command.

` npm run test`

Test will run and you can see what happen.

If you modify the target javascript source code, please change the `test/index.js`.
