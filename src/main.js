/* global MAIN_WINDOW_VITE_DEV_SERVER_URL, MAIN_WINDOW_VITE_NAME */
const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron")
const { parse, stringify } = require("yaml")
const path = require("path")
const fs = require("fs")

const defaultConfig = {
  ignoreMouseEventsShortcut: "CommandOrControl+Shift+X",
  quitShortcut: "CommandOrControl+Shift+Q",
  overlay: {
    font: "monospace",
    color: "white",
    size: "larger",
    text: "[%time%] CPU:%cpu%/RAM:%ram%/GPU:%gpu%",
  },
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit()
}

let config
const configPath = app.isPackaged
  ? path.join(app.getPath("userData"), "config.yaml")
  : path.join(__dirname, "..", "..", "src", "dev_config.yaml")
try {
  if (fs.existsSync(configPath)) {
    console.log("Reading config from :", configPath)
    config = parse(fs.readFileSync(configPath, "utf-8"))
  } else {
    fs.writeFileSync(configPath, stringify(defaultConfig))
    config = defaultConfig
  }
} catch (error) {
  console.error(error)
  config = defaultConfig
}

console.log("Config :", config)

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    alwaysOnTop: true,
    width: 600,
    height: 60,
    frame: false,
    transparent: true,
    resizable: false,
    movable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      sandbox: false,
    },
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    )
  }

  mainWindow.setAlwaysOnTop(true, "screen-saver")

  let mouseEvents = true
  globalShortcut.register(config.ignoreMouseEventsShortcut, () => {
    mouseEvents = !mouseEvents
    mainWindow.setIgnoreMouseEvents(mouseEvents)
  })

  globalShortcut.register(config.quitShortcut, app.quit)

  // Open the DevTools.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools({ mode: "detach" })
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const systeminformation = require("systeminformation")
const { spawn } = require("child_process")

ipcMain.handle("cpu", async () => {
  return (await systeminformation.currentLoad()).currentLoad
})

// ipcMain.handle("cpu", async () => {
//   return new Promise((resolve, reject) => {
//     const cmd = spawn("wmic", ["cpu", "get", "LoadPercentage"])
//     let output = ""

//     cmd.stdout.on("data", (data) => {
//       output += data.toString()
//     })

//     cmd.stderr.on("data", (data) => {
//       reject(`stderr: ${data}`)
//     })

//     cmd.on("close", (code) => {
//       if (code !== 0) {
//         reject(`Command exited with code ${code}`)
//       }

//       const lines = output.trim().split("\r\n")
//       const line2 = lines[1]
//       const percentage = parseInt(line2)
//       resolve(percentage)
//     })
//   })
// })

// nvidia-smi --query-gpu=utilization.gpu --format=csv
ipcMain.handle("gpu", async () => {
  //Séléction du gpu
  return new Promise((resolve, reject) => {
    const cmd = spawn("nvidia-smi", [
      "--query-gpu=utilization.gpu",
      "--format=csv",
    ])
    let output = ""

    cmd.stdout.on("data", (data) => {
      output += data.toString()
    })

    cmd.stderr.on("data", (data) => {
      reject(`stderr: ${data}`)
    })

    cmd.on("close", (code) => {
      if (code !== 0) {
        reject(`Command exited with code ${code}`)
      }

      const lines = output.trim().split("\r\n")
      const line2 = lines[1]
      const percentage = parseInt(line2)
      resolve(percentage)
    })
  })
})

ipcMain.handle("ram", async () => {
  const usedRam =
    (await systeminformation.mem()).total -
    (await systeminformation.mem()).available
  return (usedRam / (await systeminformation.mem()).total) * 100
})

ipcMain.handle("config", () => {
  return config
})
