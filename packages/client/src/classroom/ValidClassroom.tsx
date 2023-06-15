/* eslint-disable no-console,class-methods-use-this */
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';
import { Role, Room, Submission } from 'src/types.ts';
import socket from 'src/socket.ts';
import { ROLE_INSTRUCTOR, ROLE_STUDENT } from '../common/constants.ts';
import './ValidClassroom.scss';
import Modal from '../common/Modal.tsx';
import Layout from '../Layout.tsx';

// Custom Dev Console output
// https://github.com/iambenkay/js-ide/blob/master/index.html
function overrideConsole(consoleElement: HTMLElement) {
  function appendMessage(text: string) {
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
    argsArray.forEach((arg) => {
      if (typeof arg === 'object') {
        currentLog += `${
          JSON && JSON.stringify ? JSON.stringify(arg, undefined, 2) : arg
        } `;
      } else {
        currentLog += `${arg} `;
      }
    });

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
interface SandboxContext {
  [index: string]: Record<string, any>;
  document: Record<string, any>;
  window: Record<string, any>;
}
const sandboxGlobals: SandboxContext = {
  window: {},
  document: {},
};
function sandboxEval(codeEl: HTMLElement) {
  function createSandbox(
    code: string,
    thatContext: Record<string, any>,
    limitedGlobals: SandboxContext
  ) {
    const params: string[] = []; // the names of local variables
    const args: Record<string, any>[] = []; // the local variables

    const keys = Object.keys(limitedGlobals);
    keys.forEach((param) => {
      // console.log(`param: ${param}`);
      // eslint-disable-next-line no-prototype-builtins
      if (Object.prototype.hasOwnProperty.call(limitedGlobals, param)) {
        args.push(limitedGlobals[param]);
        params.push(param);
      }
    });
    // create the parameter list for the sandbox
    let context: Record<string, any>[] = Array.prototype.concat.call(
      thatContext,
      params,
      code
    );
    // create the sandbox function
    try {
      // @ts-ignore
      const sandbox = new (Function.prototype.bind.apply(Function, context))();
      // create the argument list for the sandbox
      context = Array.prototype.concat.call(thatContext, args);
      // bind the local variables to the sandbox
      // @ts-ignore
      return Function.prototype.bind.apply(sandbox, context);
    } catch (e) {
      console.error(e);
    }
  }
  const that: Record<string, any> = Object.create(null); // create our own this object for the user code
  const userSandbox = createSandbox(codeEl.innerText, that, sandboxGlobals); // create a sandbox
  try {
    userSandbox(); // call the user code in the sandbox
  } catch (e) {
    if (!(e instanceof TypeError)) {
      console.error(e);
    }
  }
}

// @ts-ignore
function kbdSecondKey(e) {
  if (e.key === 'i') console.clear();
  const editorTextEl = document.getElementsByClassName(
    'ace_text-layer'
  )[0] as HTMLElement;
  if (e.key === 'Enter') {
    sandboxEval(editorTextEl);
  }
}
// @ts-ignore
function kbdFirstKey(e) {
  if (e.key === 'Control') window.addEventListener('keydown', kbdSecondKey);
}
// @ts-ignore
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

async function getSubmission(roomId: number) {
  const response = await fetch(`/api/rooms/${roomId}/submission`);
  return response.json();
}

async function onUnmountWithParams(roomId: number, role: Role) {
  // Decrement attendance
  // Use Navigator beacon so that even on tab/browser close it will fire
  navigator.sendBeacon(`/api/rooms/${roomId}/${role}/decrement`);
}

const handleRunCode = () => {
  const editorTextEl = document.getElementsByClassName(
    'ace_text-layer'
  )[0] as HTMLElement;
  sandboxEval(editorTextEl);
};

const waitNSeconds = (num: number) => {
  const seconds = num * 1000;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, seconds);
  });
};

const changeToSubmitAfterNSeconds = (num: number) => {
  const seconds = num * 1000;
  return new Promise((resolve) => {
    setTimeout(() => {
      const submitCodeEl = document.getElementById('submit-code');
      if (submitCodeEl) {
        // only operate if the element is still around
        submitCodeEl.innerText = 'Submit';
      }
      resolve('resolved');
    }, seconds);
  });
};

const handleSubmitCode = async (room: Room) => {
  const body = {
    roomId: room.id,
    submission: (
      document.getElementsByClassName('ace_text-layer')[0] as HTMLElement
    ).innerText,
  };
  let submitCodeEL = document.getElementById('submit-code');
  if (submitCodeEL) {
    submitCodeEL.innerText = 'Submitting...';
  }
  await waitNSeconds(2);
  const response = await fetch(`/api/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  await response.json();
  submitCodeEL = document.getElementById('submit-code');
  if (submitCodeEL) {
    submitCodeEL.innerText = 'Submitted!';
  }
  await changeToSubmitAfterNSeconds(2);
};

type Props = {
  room: Room;
  role: Role;
};
// Convert ValidRoom to a functional component
function ValidRoom({ room, role }: Props) {
  const [hasSubmission, setHasSubmission] = useState(false);
  const aceEditor: React.RefObject<AceEditor> = React.createRef();
  const boundOnUnmount = onUnmountWithParams.bind(undefined, room.id, role);
  const boundHandleSubmit = handleSubmitCode.bind(undefined, room);
  const defaultLog = console.log;
  const defaultWarn = console.warn;
  const defaultError = console.error;
  const defaultClear = console.clear;
  // because this is being used within useEffect, it needs to be cached using useCallback
  const handleWebsocketMessage = useCallback(
    (submission: Submission) => {
      setHasSubmission(() => true);
      if (aceEditor.current) {
        aceEditor.current.editor.selectAll();
        aceEditor.current.editor.insert(submission.text);
      }
    },
    [aceEditor]
  );
  // Mirrors componentDidMount
  useEffect(() => {
    async function handleAsync() {
      window.addEventListener('beforeunload', boundOnUnmount, false);
      if (role === ROLE_INSTRUCTOR) {
        if (room.submissionId) {
          // Show the submitted code
          const submission = await getSubmission(room.id);
          setHasSubmission(() => true);
          if (aceEditor.current) {
            aceEditor.current.editor.insert(submission.text);
          }
        } else {
          // no code has been submitted yet, show a notification
          setHasSubmission(() => false);
        }
        // setup listener only for Instructor
        socket.on('change:submission', handleWebsocketMessage);
      }
      handleKeyboardShortcuts(true);
      // Override console *after* creating a sandbox around eval
      overrideConsole(document.getElementById('console') as HTMLElement);
    }
    handleAsync().catch((e) => console.error(e));
    // Functional way of calling componentWillUnmount
    return function cleanup() {
      window.removeEventListener('beforeunload', boundOnUnmount, false);
      boundOnUnmount().catch((e) => console.error(e));
      // remove override
      console.log = defaultLog;
      console.warn = defaultWarn;
      console.error = defaultError;
      console.clear = defaultClear;
      handleKeyboardShortcuts(false);
      socket.off('change:submission', handleWebsocketMessage);
    };
  }, [
    aceEditor,
    boundOnUnmount,
    defaultClear,
    defaultError,
    defaultLog,
    defaultWarn,
    handleWebsocketMessage,
    role,
    room.id,
    room.submissionId,
  ]);

  return (
    <Layout>
      <div className="classroom row no-gutters">
        <Helmet>
          <title>{`${room?.name} | Amplify`}</title>
        </Helmet>
        <div className="run-code-wrapper d-flex align-items-center justify-content-center">
          <button
            type="button"
            id="run-code"
            className="btn btn-sm btn-primary"
            onClick={handleRunCode}
          >
            Run &gt;
          </button>
          <small className="text-white font-italic ms-3">
            Or press ctrl-enter to run
          </small>
        </div>
        {ROLE_STUDENT === role && (
          <button
            type="button"
            id="submit-code"
            className="btn btn-sm btn-primary"
            onMouseUp={boundHandleSubmit}
          >
            Submit
          </button>
        )}
        <AceEditor
          mode="javascript"
          theme="monokai"
          name="amplify-code-editor"
          placeholder='console.log("hello world!");'
          width="50vw"
          ref={aceEditor}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
          }}
        />
        <pre id="console" className="col-4 pl-1">
          &raquo;{' '}
        </pre>
        {!hasSubmission && ROLE_INSTRUCTOR === role && (
          <Modal title="Wait for submission">
            <>
              <p>No submission has been made yet. Please wait...</p>
              <p>
                Go back to the <Link to="/">Lobby</Link>.
              </p>
            </>
          </Modal>
        )}
      </div>
    </Layout>
  );
}

export default ValidRoom;
