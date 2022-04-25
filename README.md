## Features

Create setters from solidity variables.

e.g. from

```javascript
   bool public isActive;
```

to

```javascript
function setIsActive(bool isActive_) public external {
		isActive = isActive_;
}
```

use

```bash
ctrl + shift + p
> Solidity : generate setters

```

### Compile (if necessary)

```bash
npm install -g vsce
vsce package
```

### Install

\> Go to plugins
\> Options
\> Install from VSIX..

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release.
