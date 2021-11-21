# vue-music

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### 后台 GitHub 地址

https://github.com/Binaryify/NeteaseCloudMusicApi

### 预览地址

[仿网易云音乐预览地址 ](http://47.102.159.133:3000/)

### 目前完成功能

- 歌曲：播放、拖动进度、歌词滚动、音量调整、下载、播放列表
- 发现页：推荐、歌单、歌手、排行榜
- 登录：登录，退出登录
- 歌单详情页：歌曲列表、歌单页搜索、加载完整歌单、收藏
- 专辑详情页：歌曲列表、搜索、收藏
- 歌手详情页：专辑列表、歌手描述、MV、相似歌手
- 视频详情页：视频播放（使用原生 video 及控件播放）、相似推荐
- MV 详情页：MV 播放、MV 推荐、MV基本信息
- 用户详情页：基本信息（地区需要引入中国省市信息。暂未加入）、创建的歌单、收藏的歌单
- 搜索：歌曲搜索
- 视频：视频列表、MV 列表、全部 MV 页
- 我的收藏：收藏的专辑、MV、歌手及筛选功能
- 最近播放
- 喜欢的音乐
- 部分页面移动端适配
- 路由懒加载及代码分块
- 添加未登录情况下导航守卫

### BUG

- 添加对歌单加载完整歌曲的限制（使用过程中遇到了个 6000 单曲的歌单，使用 trackIds 请求对应歌曲会造成 431 错误）
- 添加对最近播放歌曲数量的限制 11/19
- 解决添加导航守卫后，刷新丢失登录状态，在重新获取完登录状态就错误导航的 bug 11/20
- 添加视频播放时停止歌曲播放
