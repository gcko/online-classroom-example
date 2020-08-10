/* eslint-disable no-console */
import React from 'react';
import { Link } from 'react-router-dom';
import { Style } from 'react-style-tag';
import { Helmet } from 'react-helmet';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import Modal from '../common/Modal';
import { ROLE_INSTRUCTOR, ROLE_STUDENT } from '../common/constants';

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

async function getSubmission(roomId) {
  const response = await fetch(`/api/rooms/${roomId}/submission`);
  const submission = await response.json();
  return submission;
}

class ValidRoom extends React.Component {
  constructor(props) {
    super(props);
    this.aceEditor = React.createRef();
    this.params = this.props.params;
    this.room = this.props.room;
    this.state = {
      hasSubmission: false,
    };
    this.defaultLog = console.log;
    this.defaultWarn = console.warn;
    this.defaultError = console.error;
    this.defaultClear = console.clear;
  }

  async componentDidMount() {
    if (this.params.role === ROLE_INSTRUCTOR) {
      if (this.room.submissionId) {
        // Show the submitted code
        const submission = await getSubmission(this.room.id);
        this.setState({ hasSubmission: true });
        this.aceEditor.current.editor.insert(submission.text);
      } else {
        // no code has been submitted yet, show a notification
        this.setState({ hasSubmission: false });
      }
    }
    handleKeyboardShortcuts(true);
    // Override console *after* sandboxing eval
    overrideConsole(document.getElementById('console'));
  }

  componentWillUnmount() {
    // remove override
    console.log = this.defaultLog;
    console.warn = this.defaultWarn;
    console.error = this.defaultError;
    console.clear = this.defaultClear;
    handleKeyboardShortcuts(false);
  }

  handleRunCode = () => {
    const editorTextEl = document.getElementsByClassName('ace_text-layer')[0];
    sandboxedEval(editorTextEl);
  };

  handleSubmitCode = async () => {
    const body = {
      roomId: this.room.id,
      submission: document.getElementsByClassName('ace_text-layer')[0]
        .innerText,
    };
    // TODO change text to "Submitting..."
    const response = await fetch(`/api/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const responseJson = await response.json();
    // TODO change text to "Submitted!"
    console.log(responseJson);
  };

  render() {
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
          <title>{`${this.room.name} | Amplify`}</title>
        </Helmet>
        <div className="run-code-wrapper position-absolute">
          <button
            type="button"
            id="run-code"
            className="btn btn-sm btn-outline-light"
            onClick={this.handleRunCode}
          >
            Run &gt;
          </button>
          <small className="text-white font-italic ml-1">
            Or press ctrl-enter to run
          </small>
        </div>
        {ROLE_STUDENT === this.params.role && (
          <button
            type="button"
            id="submit-code"
            className="btn btn-sm btn-outline-light position-absolute"
            onMouseUp={this.handleSubmitCode}
          >
            Submit
          </button>
        )}
        <AceEditor
          mode="javascript"
          theme="monokai"
          name="amplify-code-editor"
          placeholder='console.log("hello world!");'
          width="auto"
          // value=""
          className="col-8"
          ref={this.aceEditor}
          editorProps={{ $blockScrolling: true }}
        />
        <pre id="console" className="col-4 pl-1">
          &raquo;{' '}
        </pre>
        {!this.state.hasSubmission && ROLE_INSTRUCTOR === this.params.role && (
          <Modal title="Wait for submission">
            <p>No submission has been made yet. Please wait...</p>
            <p>
              Go back to the <Link to="/">Lobby</Link>.
            </p>
          </Modal>
        )}
      </div>
    );
  }
}

export default ValidRoom;
