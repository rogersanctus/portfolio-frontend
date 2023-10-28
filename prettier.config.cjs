/** @type {import ('prettier').Config} */
module.exports = {
  ...require('prettier-config-standard'),
  editorConfig: true,
  singleQuote: true,
  semi: false,
  trailingComma: 'none',
  pluginSearchDirs: [__dirname],
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: ['*.astro'],
      options: {
        parser: 'astro'
      }
    }
  ]
}
