// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron")

let config
(async () => {
  config = await ipcRenderer.invoke("config")
  contextBridge.exposeInMainWorld("config", config)
})()

contextBridge.exposeInMainWorld("systeminformation", {
  cpuUsage: async () => {
    return await ipcRenderer.invoke("cpu")
  },
  gpuUsage: async () => {
    return ipcRenderer.invoke("gpu")
  },
  ramUsage: async () => {
    return ipcRenderer.invoke("ram")
  }
})