# Tools

## dox_id
An easy and quick way to generate a universally unique id for a dox comment.
- Currently only supported on Windows
- Requires AutoHotkey
- Requires NodeJS

### How To Use
It's as easy as double clicking on the AutoHotKey script and using `alt + v` on your keyboard to generate and consecutively paste the uuid wherever your cursor is located. It will automatically install the npm package `uuid` globally if it is not already available in the PATH. If an error occurs, it will paste an error message instead of the uuid.
