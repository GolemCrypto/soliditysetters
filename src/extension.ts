// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "soliditysetters" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "soliditysetters.soliditysetter",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      //vscode.window.showInformationMessage("Hello World from SoliditySetters!");

      var editor = vscode.window.activeTextEditor;

      if (!editor) return; // No open text editor

      var selection = editor.selection;

      console.log("selection:", selection);
      var text = editor.document.getText(selection);

      if (text.length < 1) {
        vscode.window.showErrorMessage("No selected properties.");
        return;
      }

      try {
        var getterAndSetter = createGetterAndSetter(text);

        editor.edit((edit) =>
          editor?.selections.forEach((selection) => {
            edit.insert(selection.end, getterAndSetter);
          })
        );

        // format getterAndSetter
        vscode.commands.executeCommand("editor.action.formatSelection");
      } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(
          'Something went wrong! Try that the properties are in this format: "private String name;"'
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

function toPascalCase(str: String) {
  return str.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1));
}

function createGetterAndSetter(textPorperties: String) {
  var properties = textPorperties
    .split(/\r?\n/)
    .filter((x) => x.length > 2)
    .map((x) => x.replace(";", ""));

  var generatedCode = `
`;
  for (let p of properties) {
    while (p.startsWith(" ")) p = p.substr(1);
    while (p.startsWith("\t")) p = p.substr(1);

    let words = p.split(" ").map((x) => x.replace(/\r?\n/, ""));
    let type,
      attribute,
      Attribute = "";
    let create = false;

    // if words == ["private", "String", "name"];
    if (words.length > 2) {
      type = words[0];
      attribute = words[2];
      Attribute = toPascalCase(words[2]);

      create = true;
    }
    // if words == ["String", "name"];
    else if (words.length == 2) {
      type = words[0];
      attribute = words[1];
      Attribute = toPascalCase(words[1]);

      create = true;
    }
    // if words == ["name"];
    else if (words.length) {
      type = "Object";
      attribute = words[0];
      Attribute = toPascalCase(words[0]);

      create = true;
    }

    if (create) {
      let code = `
function set${Attribute}(${type} ${attribute}_) public external {
\t\t${attribute} = ${attribute}_;
}
`;
      /*
for getters (mostly useless for solidity SCs)
\tfunction  ${
        type?.startsWith("bool") ? "is" : "get"
      }${Attribute}() public view returns (${type}) {
\t\treturn ${attribute};
\t}
*/
      generatedCode += code;
    }
  }

  return generatedCode;
}

// this method is called when your extension is deactivated
export function deactivate() {}
