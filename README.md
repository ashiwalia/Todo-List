<div align="center">
<img- [🔥 Firebase Firestore Setup ](#-firebase-firestore-setup-)
- [📋 Firebase Setup Guide](FIREBASE_SETUP.md) src="screenshots/6.png">
</div>

<div align="center">

[![GitHub contributors](https://img.shields.io/github/contributors/ZiadSheriif/Todo-List)](https://github.com/ZiadSheriif/Todo-List/contributors)
[![GitHub issues](https://img.shields.io/github/issues/ZiadSheriif/Todo-List)](https://github.com/ZiadSheriif/Todo-List/issues)
[![GitHub license](https://img.shields.io/github/license/ZiadSheriif/Todo-List)](https://github.com/ZiadSheriif/Todo-List/blob/master/LICENSE)
[![GitHub forks](https://img.shields.io/github/forks/ZiadSheriif/Todo-List)](https://github.com/ZiadSheriif/Todo-List/network)
[![GitHub stars](https://img.shields.io/github/stars/ZiadSheriif/Todo-List)](https://github.com/ZiadSheriif/Todo-List/stargazers)
[![GitHub Language](https://img.shields.io/github/languages/top/ZiadSheriif/Todo-List)](https://img.shields.io/github/languages/count/ZiadSheriif/Todo-List)

</div>

## 📝 Table of Contents

- [📝 Table of Contents](#-table-of-contents)
- [📙 About ](#-about-)
- [🌠 Features ](#-features-)
- [📂 Folder Structure ](#-folder-structure-)
- [🏁 Getting Started ](#-getting-started-)
  - [Prerequisite ](#prerequisite-)
  - [Installation ](#installation-)
  - [Running ](#running-)
- [� Firebase Firestore Setup ](#-firebase-firestore-setup-)
- [�💻 Built Using ](#-built-using-)
- [📸 Demo Screens ](#-demo-screens-)
- [🕴 Contributors ](#-contributors-)
- [⏳ Backlog](#-backlog)
- [📃 License ](#-license-)

## 📙 About <a name = "about"></a>

A to do List application that allows users to create and manage their tasks. It provides a simple and intuitive interface for users to add, edit, delete, and complete tasks.


## 🌠 Features <a name= "features"></a>
1. Ability to add new tasks.
2. Ability to view tasks based on different categories, **_such as_** 
   - Today's Tasks
   - All Tasks
   - Important Tasks
   - Completed Tasks
   - Working Tasks
   - Uncompleted Tasks
3. Ability to mark tasks as **completed**, **working**, or **uncompleted**.
4. Ability to edit and delete tasks.
5. Ability to search for tasks using a search bar.
6. Responsive design that works well on desktop and mobile devices.
7. Integration with local storage to persist data between sessions.
8. **🆕 Firebase Cloud Storage Integration** - Sync your tasks to Firebase Firestore for real-time storage across devices and browsers.

## 🔥 Firebase Firestore Setup <a name="firebase-setup"></a>

The Todo List now supports cloud storage through Firebase Firestore integration. This allows your tasks to persist across devices with real-time synchronization and offline support.

### Quick Setup Guide (Firebase Firestore)

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project or select an existing one
   - No credit card required for the free tier

2. **Enable Firestore Database:**
   - Go to 'Firestore Database' in the sidebar
   - Click 'Create database'
   - Choose 'Start in test mode' for now (you can secure it later)
   - Select a location close to your users

3. **Get Your Firebase Config:**
   - Go to Project Settings (gear icon)
   - Scroll down to 'Your apps' section
   - Click 'Add app' and select Web (</>) if no web app exists
   - Register your app with a nickname
   - Copy the firebaseConfig object

4. **Configure Through UI:**
   - Click the Firebase badge in the app header
   - Enter your Firebase credentials in the configuration form
   - Click 'Test Connection' to verify
   - Click 'Save Configuration' to store locally

5. **Verification:**
   - The app will automatically sync tasks with Firebase
   - Check the Firebase status badge in the header
   - Your tasks will now sync across all devices in real-time

### Benefits of Firebase Firestore
- ✅ Real-time synchronization across devices
- ✅ Offline support with automatic sync when online
- ✅ Free tier with generous limits (1GB storage, 50K reads/day)
- ✅ No external API keys needed for basic functionality
- ✅ Advanced security rules for production use
- ✅ Scalable infrastructure by Google
- ✅ Built-in authentication support
- ✅ UI-configurable (no environment variables needed)

### Notes
- Firebase credentials are stored locally in your browser
- Works perfectly offline - changes sync when connection is restored
- The app works completely without Firebase (offline mode)
- Since this is hosted on GitHub Pages, Firebase credentials are configured through the UI instead of environment variables

> [!NOTE]
> I am still working on the project, this is not the final verison of it, I just make it public to get feedback and imporve it

## 📂 Folder Structure <a name= "folder-structure"></a>

```sh
├───Assets
│   └───images
├───Components
│   ├───CardTask
│   ├───DeleteTaskModal
│   ├───LeftSideBar
│   ├───RightSideBar
│   ├───SearchBar
│   ├───TaskModal
│   └───ToastModal
├───Hooks
├───Layouts
│   ├───Header
│   └───ShowTasks
├───Pages
│   └───HomePage
├───Theme
└───Utils
```
## 🏁 Getting Started <a name = "get-started"></a>

> This is an list of needed instructions to set up your project locally, to get a local copy up and running follow these
> instructuins.

### Prerequisite <a name = "req"></a>

1. Node.js

### Installation <a name = "Install"></a>

1. **_Clone the repository_**

```sh
$ git clone https://github.com/ZiadSheriif/Todo-List.git
```

2. **_Navigate to TodoList Folder_**

```sh
$ cd TodoList
```

### Running <a name = "running"></a>

**_Running program_**

1. **_Install modules_**

```sh
npm install 
```
2. **_Start program_**

```sh
npm start
```
## 💻 Built Using <a name = "tech"></a>

- **ReactJs**
- **React Bootstrap**

## 📸 Demo Screens <a name = "screens"></a>

<div align="center">
<h3 align='left'>All Tasks</h3>
   <img src="screenshots/1.png">
<h3 align='left'>Today's Tasks</h3>
   <img src="screenshots/2.png">

<h3 align='left'>Important Tasks</h3>
<img src="screenshots/3.png">
<h3 align='left'>Completed Tasks</h3>
<img src="screenshots/4.png">
<h3 align='left'>Add task</h3>
<img src="screenshots/8.png">
<h3 align='left'>Edit task</h3>
<img src="screenshots/9.png">
<h3 align='left'>Delete task</h3>
<img src="screenshots/10.png">
<h3 align='left'>Notifications</h3>
<img src="screenshots/11.png">
<h3 align='left'>Responsitivity</h3>
<img src="screenshots/12.png">
</div>

## 🕴 Contributors <a name = "Contributors"></a>

<table>
  <tr>
    <td align="center">
    <a href="https://github.com/ZiadSheriif" target="_black">
    <img src="https://avatars.githubusercontent.com/u/78238570?v=4" width="150px;" alt="Ziad Sherif"/>
    <br />
    <sub><b>Ziad Sherif</b></sub></a>
    </td>
    
    
  </tr>
 </table>

 ## ⏳ Backlog
 - [x] ~~Add a feature to categorize tasks, allowing users to filter tasks by category.~~
 - [x] ~~Implement a due date feature that allows users to set a due date for tasks and receive reminders when tasks are approaching their deadline.~~
 - [x] ~~Add the ability to sort tasks by various criteria, such as due date, priority, or category.~~
 - [ ] Store tasks in a JSON file instead of local storage. 
 - [x] ~~Implement a search functionality to enable users to search for specific tasks by keyword or phrase.~~
 - [x] ~~Add the ability to prioritize tasks by assigning them different levels of importance or urgency.~~
 - [ ] Implement a calendar view that shows tasks on a monthly or weekly calendar, making it easier for users to plan and manage their tasks.
 - [ ] Add directory that user can attach task in a sub directory.
 - [ ] Implement authentication and authorization features to allow users to create and manage their own tasks.
 - [ ] Allow users to drag and drop tasks to rearrange their order or move them between categories.
 - [x] ~~Ability to filter tasks by status (all, active, completed).~~
 - [x] ~~Ability to edit task details.~~ 





## 📃 License <a name = "license"></a>

> This software is licensed under MIT License, See [License](https://github.com/ZiadSheriif/Todo-List/blob/main/LICENSE) for more information ©ZiadSheriif.
