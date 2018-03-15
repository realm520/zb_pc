# ZB-Client

**项目简介**

ZB交易所PC端应用，基于 electron [Quick Start Guide](http://electron.atom.io/docs/tutorial/quick-start).

**查看 [Electron API Demos](http://electron.atom.io/#get-started) 获取更多帮助.**

You can learn more about each of these components within the [Quick Start Guide](http://electron.atom.io/docs/tutorial/quick-start).

## 使用

你需要在你的电脑上安装 [Git](https://git-scm.com) 和 [Node.js](https://nodejs.org/en/download/) (带 [npm](http://npmjs.com)) 来运行应用. 在命令行输入:

```bash
# Clone this repository
git clone https://github.com/realm520/zb_pc.git
# Go into the repository
cd zb_pc
# Install dependencies
npm install
# Run the app
npm start
```

## 发布

本程序使用 [electron-packager](https://github.com/electron-userland/electron-packager) 打包发布. 在命令行输入:
```bash
# pack Win32 version
npm run-script pack-win32
# pack Win64 version
npm run-script pack-x64
# pack MacOS version
npm run-script create-installer-mac
```

## License

[MIT (Public Domain)](LICENSE.md)
