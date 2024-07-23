# Nvidia Record Organizer
![logo](/resources/Icon.png)

## 介绍
一个个人自用的Nvidia游戏回放整理命名工具

项目的定位是专门用于整理Nvidia游戏的回放文件，因此软件对Nvidia回放文件整理的使用场景做了针对性的优化，依据图片创建的时间间隔来对图片进行分组，以便更好地批量重命名文件。


```text
虽然但是其实后期再改改也可以通用地整理一般性的文件
```
### 软件内部一览
![主页](/public/home.png)
软件主页

点击图片可以放大查看
![detail](/public/detail.png)

选中图片后可以点击右上角的蓝色按钮进入改名界面

![renameWin](/public/renameWin.png)

在这里你可以看到选中图片的最长间隔时间，确保它们不太长以防止错误地选中间隔过长的文件

同时可以使用改名方案来格式化地重命名文件名，针对可能重复的文件，此处提供了{indexIfRepeat}变量来防止重复命名，其余的变量均来自原本的文件名。

确定信息以后点击右上角的按钮即可开始改名

在主页，你还可以点击右上角的设置按钮打开独立的设置窗口

![setting](/public/setting.png)
设置窗口

在这里你可以设置图片的显示大小，主页自动刷新的间隔秒数以及分组的其它选项。

![home_m](/public/home_m.png)
中等大小

![home_l](/public/home_l.png)
偏大

## 碎碎念

继上一个“健康使用电脑（HUC）”项目之后时隔多月，不顾上一个项目的丑陋外观又开发了另一个项目——Nvidia Record Organizer

这次的项目UI设计以及对于Electron api、typescript的运用更为现代化，动画方面也有所进步

目前项目已经基本可用（至少应该不会导致数据丢失）

这次的项目开发周期从10号期末结束到22号基本完成当前功能，相较于上个项目的开发时间显然熟练了许多。

项目由初学者开发且仍然仍未完成全部设想，请看到的大佬轻喷，同时也非常欢迎任何宝贵意见！
## 推荐IDE

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 项目初始化

### Install

```bash
$ npm install
```

### 开发

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
