/* eslint-disable no-console */
import React, { useEffect, useRef } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Style } from 'react-style-tag';
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
    span.textContent = text;
    consoleElement.appendChild(span);
  }
  const defaultLog = console.log.bind(window);
  const defaultClear = console.clear.bind(window);
  const defaultError = console.error.bind(window);
  const defaultWarn = console.warn.bind(window);

  // Override console.log
  console.log = function log(...args) {
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
  console.clear = function clear() {
    // Clear out any messages, add console prompt
    consoleElement.innerHTML = `» `;
    // Allow the default console action to happen
    defaultClear();
  };

  // Override console.error
  console.error = function error(e) {
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
  console.warn = function warn(w) {
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
  window: {},
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

function kbdSecondKey(e) {
  if (e.key === 'i') console.clear();
  const editorTextEl = document.getElementsByClassName('ace_text-layer')[0];
  if (e.key === 'Enter') {
    sandboxedEval(editorTextEl);
  }
}
function kbdFirstKey(e) {
  if (e.key === 'Control') window.addEventListener('keydown', kbdSecondKey);
}
function kbuFirstKey(e) {
  if (e.key === 'Control') window.removeEventListener('keydown', kbdSecondKey);
}
function handleKeyboardShortcuts(on = true) {
  if (on) {
    window.addEventListener('keydown', kbdFirstKey);
    window.addEventListener('keyup', kbuFirstKey);
  }
  if (!on) {
    window.removeEventListener('keydown', kbdFirstKey);
    window.removeEventListener('keyup', kbuFirstKey);
  }
}

function ValidClassroom({ params }) {
  function handleRunCode() {
    const editorTextEl = document.getElementsByClassName('ace_text-layer')[0];
    sandboxedEval(editorTextEl);
  }
  function handleSubmitCode() {
    const editorTextEl = document.getElementsByClassName('ace_text-layer')[0];
    // TODO Submit the code to the backend and provide it to the instructor
    console.log(editorTextEl.innerText);
  }

  return (
    <div className="classroom row no-gutters">
      <Style>
        {`
        .amplify-app > footer a,
          .amplify-app > footer a,
          .amplify-app > footer a:visited,
          .amplify-app > footer a:hover,
          .amplify-app > footer a:link,
          .amplify-app > footer span {
          color: #FFEFFF;
        }
      `}
      </Style>
      <Helmet>
        {/* TODO programmatic title */}
        <title>{`${params.roomId} | Amplify`}</title>
      </Helmet>
      <div className="run-code-wrapper position-absolute">
        <button
          type="button"
          id="run-code"
          className="btn btn-sm btn-outline-light"
          onClick={handleRunCode}
        >
          Run &gt;
        </button>
        <small className="text-white font-italic ml-1">
          Or press ctrl-enter to run
        </small>
      </div>
      <button
        type="button"
        id="submit-code"
        className="btn btn-sm btn-outline-light position-absolute"
        onMouseUp={handleSubmitCode}
      >
        Submit
      </button>
      <AceEditor
        mode="javascript"
        theme="monokai"
        name="amplify-code-editor"
        placeholder='console.log("hello world!");'
        width="auto"
        // value=""
        className="col-8"
        editorProps={{ $blockScrolling: true }}
      />
      <pre id="console" className="col-4 pl-1">
        &raquo;{' '}
      </pre>
    </div>
  );
}

function Classroom() {
  // Grab the params from the Route
  const params = useParams();
  // const [isValid, setIsValid] = useState(false);
  const isValid = useRef(false);

  function roomIdIsValid() {
    // TODO pull from server (same as Lobby.js)
    const validRooms = [
      {
        roomId: '11111111',
        name: 'Javascript 101',
      },
      {
        roomId: 'ABCDEFGH',
        name: 'Javascript 201',
      },
    ];
    const validRoles = ['student', 'instructor'];
    let stateOfValidity = false;
    for (let i = 0; i < validRooms.length; i += 1) {
      if (params.roomId === validRooms[i].roomId) {
        stateOfValidity = validRoles.indexOf(params.role) >= 0;
      }
    }
    // return true;
    return stateOfValidity;
  }
  // Set the referenced state for isValid
  isValid.current = roomIdIsValid();

  useEffect(() => {
    const defaultLog = console.log;
    const defaultWarn = console.warn;
    const defaultError = console.error;
    const defaultClear = console.clear;
    handleKeyboardShortcuts(true);
    // Override console *after* sandboxing eval
    overrideConsole(document.getElementById('console'));
    return function cleanup() {
      // remove override
      console.log = defaultLog;
      console.warn = defaultWarn;
      console.error = defaultError;
      console.clear = defaultClear;
      handleKeyboardShortcuts(false);
      isValid.current = false;
    };
  }, []); // empty array means call only once

  return (
    // First check the roomId is valid
    <>
      {isValid.current ? (
        <ValidClassroom params={params} />
      ) : (
        <Redirect
          to={{
            pathname: '/',
          }}
        />
      )}
    </>
  );
}

export default Classroom;
