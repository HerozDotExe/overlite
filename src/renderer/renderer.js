/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

/* global systeminformation */
/* global config */
import "./index.css"

function formatPercentage(percentage) {
  if ((percentage < 100) & (percentage > 9)) {
    return "0" + Math.round(percentage) + "%"
  } else if (percentage < 10) {
    return "00" + Math.round(percentage) + "%"
  } else {
    return "100%"
  }
}

function formatTime(time) {
  if (time < 10) {
    return "0" + time
  } else return time
}

const overlay = document.getElementById("overlay")
window.onload = () => {
  console.log(config)
  overlay.style.fontFamily = config.overlay.font || "monospace"
  overlay.style.color = config.overlay.color || "white"
  overlay.style.fontSize = config.overlay.size || "larger"
}

setInterval(async () => {
  const now = new Date(Date.now())
  const time = `${formatTime(now.getHours())}:${formatTime(
    now.getMinutes()
  )}`
  const cpu = formatPercentage(await systeminformation.cpuUsage())
  const gpu = formatPercentage(await systeminformation.gpuUsage())
  const ram = formatPercentage(await systeminformation.ramUsage())

  // overlay.innerText = `${time} CPU:${cpu}/RAM:${ram}/GPU:${gpu}`

  overlay.innerText = config.overlay.text
    .replace("%time%", time)
    .replace("%cpu%", cpu)
    .replace("%gpu%", gpu)
    .replace("%ram%", ram)
}, 1000)