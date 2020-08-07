import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import './Classroom.sass';

// Custom Dev Console output
// https://github.com/iambenkay/js-ide/blob/master/index.html
function overrideConsole(consoleElement) {
  function appendMessage(text) {
    const span = document.createElement('span');
    span.className = 'message';
    // span.setAttribute('style', 'white-space: pre;');
    span.textContent = text;
    consoleElement.appendChild(span);
  }
  const defaultLog = console.log;
  const defaultClear = console.clear;
  const defaultError = console.error;
  const defaultWarn = console.warn;

  // Override console.log
  console.log = function(...args) {
    let currentLog = '';
    const argsArray = [...args];
    for (let i = 0; i < argsArray.length; i += 1) {
      const arg = argsArray[i];
      if (typeof arg === 'object') {
        currentLog += `${
          JSON && JSON.stringify ? JSON.stringify(arg, undefined, 2) : arg
        } `;
      } else {
        currentLog += `${arg} `;
      }
    }
    // for (const arg of args) {}
    // add the console prompt
    currentLog += `\r\n» `;
    // Append the new log to the existing log
    appendMessage(currentLog);
    // Ensure the console is scrolled to the bottom
    consoleElement.scrollTop = consoleElement.scrollHeight;
    // Pass to the default console
    defaultLog(...args);
  };

  // Override console.clear
  console.clear = function() {
    // Clear out any messages, add console prompt
    consoleElement.innerHTML = `» `;
    // Allow the default console action to happen
    defaultClear();
  };

  // Override console.error
  console.error = function(e) {
    let currentLog = '';
    currentLog += `Error: ${e}`;
    // Console prompt
    currentLog += `\r\n» `;
    appendMessage(currentLog);
    // So console is always scrolled to the bottom
    consoleElement.scrollTop = consoleElement.scrollHeight;

    // Allow the default console action to happen
    defaultError(e);
  };

  // Override console.warn
  console.warn = function(w) {
    let currentLog = '';
    currentLog += `Warning: ${w}`;
    // Console prompt
    currentLog += '\r\n» ';
    appendMessage(currentLog);
    // So console is always scrolled to the bottom
    consoleElement.scrollTop = consoleElement.scrollHeight;
    // Allow the default console action to happen
    defaultWarn(w);
  };
}

// create our own local versions of window and document with limited functionality.
// Do it once and before other code executes.
const sandboxGlobals = {
  window: {
    // console: getOverriddenConsole(document.getElementById('console')), // allow a reference to console
    // console: console, // allow a reference to the console
  },
  document: {},
};
function sandboxedEval(codeEl) {
  function createSandbox(code, thatContext, sandboxedGlobals) {
    const params = []; // the names of local variables
    const args = []; // the local variables

    const keys = Object.keys(sandboxedGlobals);
    for (let i = 0; i < keys.length; i += 1) {
      const param = keys[i];
      // console.log(`param: ${param}`);
      // eslint-disable-next-line no-prototype-builtins
      if (Object.prototype.hasOwnProperty.call(sandboxedGlobals, param)) {
        // console.log(`arg for param: ${sandboxedGlobals[param]}`);
        args.push(sandboxedGlobals[param]);
        params.push(param);
      }
    }
    // create the parameter list for the sandbox
    let context = Array.prototype.concat.call(thatContext, params, code);
    // create the sandbox function
    try {
      // eslint-disable-next-line
      const sandbox = new (Function.prototype.bind.apply(Function, context));
      // create the argument list for the sandbox
      context = Array.prototype.concat.call(thatContext, args);
      // bind the local variables to the sandbox
      return Function.prototype.bind.apply(sandbox, context);
    } catch (e) {
      console.error(e);
    }
  }
  const that = Object.create(null); // create our own this object for the user code
  const userSandbox = createSandbox(codeEl.innerText, that, sandboxGlobals); // create a sandbox
  try {
    userSandbox(); // call the user code in the sandbox
  } catch (e) {
    if (!(e instanceof TypeError)) {
      console.error(e);
    }
  }
}

function handleKeyboardShortcuts(on = true) {
  function kbd(e) {
    if (e.key === 'i') console.clear();
    const editorTextEl = document.getElementsByClassName('ace_text-layer')[0];
    if (e.key === 'Enter') {
      sandboxedEval(editorTextEl);
      // try {
      //   eval(editorTextEl.innerText);
      // } catch (error) {
      //   console.error(error);
      // }
    }
  }
  function kbdCtrl(e) {
    if (e.key === 'Control') window.addEventListener('keydown', kbd);
  }
  function kbuCtrl(e) {
    if (e.key === 'Control') window.removeEventListener('keydown', kbd);
  }
  if (on) {
    window.addEventListener('keydown', kbdCtrl);
    window.addEventListener('keyup', kbuCtrl);
  }
  if (!on) {
    window.removeEventListener('keydown', kbdCtrl);
    window.removeEventListener('keyup', kbuCtrl);
  }
}

function Classroom() {
  useEffect(() => {
    const defaultLog = console.log;
    handleKeyboardShortcuts(true);
    // Override console *after* sandboxing eval
    overrideConsole(document.getElementById('console'));
    return function cleanup() {
      // remove override
      console.log = defaultLog;
      handleKeyboardShortcuts(false);
    };
  });

  return (
    <div className="classroom row">
      <Helmet>
        {/* TODO programmatic title */}
        <title>JS 101 | Amplify</title>
      </Helmet>
      <AceEditor
        mode="javascript"
        theme="monokai"
        name="amplify-code-editor"
        className="col-8"
        editorProps={{ $blockScrolling: true }}
      />
      <pre id="console" className="col-4">
        &raquo;{' '}
      </pre>
    </div>
  );
}

export default Classroom;
