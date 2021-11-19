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

### 后台GitHub地址

https://github.com/Binaryify/NeteaseCloudMusicApi

### 预览地址

[仿网易云音乐预览地址 ](http://47.102.159.133:3000/)

### 目前完成功能

+ 歌曲：播放、拖动进度、歌词滚动、音量调整、下载、播放列表
+ 发现页：推荐、歌单、歌手、排行榜
+ 最近播放
+ 喜欢的音乐
+ 登录：登录，退出登录
+ 歌单详情页：歌曲列表、歌单页搜索、加载完整歌单
+ 专辑详情页：歌曲列表、搜索
+ 歌手详情页：专辑列表、歌手描述
+ 视频详情页：视频播放（使用原生video及控件播放）、相似推荐
+ MV详情页：MV播放、MV推荐
+ 搜索：歌曲搜索
+ 视频：视频列表、MV列表、全部MV页
+ 部分页面移动端适配
+ 路由懒加载及代码分块

### BUG
+ 添加对歌单加载完整歌曲的限制（使用过程中遇到了个6000单曲的歌单，使用trackIds请求对应歌曲会造成431错误）
+ 添加对最近播放歌曲数量的限制 11/19