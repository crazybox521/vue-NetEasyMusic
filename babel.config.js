// 项目发布阶段需要用到的Babel插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins: [
    ...prodPlugins,
    //配置路由懒加载插件
    "@babel/plugin-syntax-dynamic-import",
    /* element按需加载 */
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
