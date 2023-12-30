# Overlite
A small overlay that show cpu/gpu/ram usage and the current time. **Only for windows.**

## Customization
You can edit `config.yml` (stored at %appdata%\overlite). 
The default config looks like this :
```yml
ignoreMouseEventsShortcut: "CommandOrControl+Shift+X"
quitShortcut: "CommandOrControl+Shift+Q"
overlay:
  font: "monospace" # css => font-family
  color: "white" # css => color
  size: "larger" # css => font-size
  text: "[%time%] CPU:%cpu%/RAM:%ram%/GPU:%gpu%"
```
The text value is the text showed on the overlay, you can change it to whatever you want and you may include any of those placeholder :
- `%cpu%` => replaced by cpu usage in percentage (with the %)
- `%gpu%` => replaced by gpu usage in percentage (with the %)
- `%ram%` => replaced by ram usage in percentage (with the %)
- `%time%` => replaced by current time eg: `12:15`

## Building
1. Clone the repo and cd into it
2. Run `yarn install`
3. Do your changes
4. Use `yarn run start` to preview changes (with devtools)
5. Use `yarn run build` to generate the app for windows