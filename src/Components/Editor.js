import React from 'react';
import '../css/component.css';

import {
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
  convertToRaw,
  AtomicBlockUtils,
} from 'draft-js';

import Editor, {
  composeDecorators,
  AlignmentDecorator,
} from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';

import blockButtons from './Blocks.json';
import inlineStyleButtons from './Inlinestyle.json';
import { SketchPicker } from 'react-color';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];
//---------------------------Editor Class start --------------------------//

// let contentState = stateFromHTML(html);
let contentState = stateFromHTML('<p>Hello</p>');

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    //-------define number of function and bind it to the component -----//

    this.state = {
      HTMLContent: '',
      editorState: EditorState.createWithContent(this.props.data),
      displayColorPicker: false,
      background: '#fff',
      styleMap: {
        HIGHLIGHT: { backgroundColor: '#fff' },
      },
      imge: null,
    };
    //-------define number of function and bind it to the component -----//
    this.onChange = (editorState) => {
      this.state.HTMLContent = stateToHTML(editorState.getCurrentContent());

      const contentState = editorState.getCurrentContent();

      // console.log('content state', convertToRaw(contentState));
      this.setState({ editorState });
    };
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.renderInlineStyleButton = this.renderInlineStyleButton.bind(this);
    this.renderBlockButton = this.renderBlockButton.bind(this);
    this.keyBindingFunction = this.keyBindingFunction.bind(this);
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    // this.insertImage = this.insertImage.bind(this);
    this.onAddImage = this.onAddImage.bind(this);
    // this.handlePastedText = this.handlePastedText.bind(this)
  }

  //---------------------- Handel Pasted Text -----------------------------------//
  //--------------------------------------------------------------------------//
  //---------------- creat a group of button from an array ---------------------//
  //----------------------------------------------------------------------------//
  renderInlineStyleButton(value, style, icon) {
    return (
      <span
        className={`ItemIcons  ${icon}`}
        key={style}
        value={value}
        data-style={style}
        onMouseDown={this.toggleInlineStyle}
      />
    );
  }
  renderBlockButton(value, block, icon) {
    return (
      <span
        className={`ItemIcons ${icon}`}
        key={block}
        value={value}
        data-block={block}
        onMouseDown={this.toggleBlockType}
      />
    );
  }

  //------------------------------------------------------------------------------------//
  //------------this Makes the ColorPicker to be Displayed and undisplay----------------//
  //------------------------------------------------------------------------------------//
  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };
  //---------------------------------------------------------------//
  //---------- handel the close of the pickr ----------------------//
  //---------------------------------------------------------------//
  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  //---------------------------------------------------------------//
  //------- handel the picking of the color of the pickr ----------//
  //---------------------------------------------------------------//
  handleChangeComplete = (color) => {
    this.setState({
      background: color.hex,
      styleMap: { HIGHLIGHT: { backgroundColor: color.hex } },
    });
  };

  //----------------------------------------------------------------------------------------------------------------------------------------------------------//
  //---If RichUtils.handleKeyCommand didn't find anything, check for our custom strikethrough command and call `RichUtils.toggleInlineStyle` if we find it----//
  //----------------------------------------------------------------------------------------------------------------------------------------------------------//
  keyBindingFunction(event) {
    if (
      KeyBindingUtil.hasCommandModifier(event) &&
      event.shiftKey &&
      event.key === 'x'
    ) {
      return 'strikethrough';
    }

    if (
      KeyBindingUtil.hasCommandModifier(event) &&
      event.shiftKey &&
      event.key === '9'
    ) {
      return 'blockquote';
    }

    if (
      KeyBindingUtil.hasCommandModifier(event) &&
      event.shiftKey &&
      event.key === 'h'
    ) {
      return 'highlight';
    }

    return getDefaultKeyBinding(event);
  }
  //-----------------------------------------------------------------------------------------//
  //------------------------------ Handel the command of the button -------------------------//
  //-----------------------------------------------------------------------------------------//
  handleKeyCommand(command) {
    // inline formatting key commands handles bold, italic, code, underline
    var editorState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );

    if (!editorState && command === 'strikethrough') {
      editorState = RichUtils.toggleInlineStyle(
        this.state.editorState,
        'STRIKETHROUGH'
      );

      if (!editorState && command === 'blockquote') {
        editorState = RichUtils.toggleBlockType(
          this.state.editorState,
          'blockquote'
        );
      }
    }

    if (!editorState && command === 'highlight') {
      editorState = RichUtils.toggleInlineStyle(
        this.state.editorState,
        'HIGHLIGHT'
      );
    }

    if (editorState) {
      this.setState({ editorState });
      return 'handled';
    }

    return 'not-handled';
  }
  //-------------------------------------------------------------------------------------------------//
  //--------------------this function takes the target of the event ---------------------------------//
  //----------------and then get the data-style attributes from it then -----------------------------//
  //------------------------give it to the togelefunction of the editor -----------------------------//
  //-------------------------------------------------------------------------------------------------//

  toggleInlineStyle(event) {
    event.preventDefault();
    let style = event.currentTarget.getAttribute('data-style');
    if (style === 'HIGHLIGHT') {
      this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }

    this.setState({
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, style),
    });
  }
  //-------------------------------------------------------------------------------//
  ///------------- this function is to creat an act for styling Issues ------------//
  //-------------------------------------------------------------------------------//
  toggleBlockType(event) {
    event.preventDefault();

    let block = event.currentTarget.getAttribute('data-block');
    this.setState({
      editorState: RichUtils.toggleBlockType(this.state.editorState, block),
    });

    console.log(this.state.editorState);
  }

  //----------------------------------------------------------------------//
  //----------- Define a Custom Style for Us -----------------------------//
  //----------------------------------------------------------------------//
  componentDidMount() {
    let contentState = stateFromHTML('<p>مرحبا </p>');
    EditorState.createWithContent(contentState);
  }

  //------------- Func to convet Dom to string ----------------------------//
  convertDomToHtmlString() {
    console.log(this.state.HTMLContent);
    return this.state.HTMLContent.toString()
      .trim()
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/[\n\r]/g, '\\n');
  }

  //------------------- a Func to convert string to HTML -------------------//
  convertHTMLStringToDom(data) {
    var dom = data.replace('/', '\\');
    // var dom = new DOMParser().parseFromString(data, 'text/html');
    return dom;
  }

  //--------------------rendering the impage and uploads --------------------------------//
  handleDropdownChange(e) {
    console.log(e.target.value);
    if (e.target.value === 'non') {
      this.setState({
        type: e.target.value,
        disabled: true,
      });
    } else {
      this.setState({ type: e.target.value, disabled: false });
    }
  }
  onChangeHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    });
    var file = document.querySelector('input[type=file]')['files'][0];
    var reader = new FileReader();
    var baseString;
    var that = this;
    reader.onloadend = function () {
      baseString = reader.result;
      console.log(baseString);
      that.onAddImage(baseString);
    };
    reader.readAsDataURL(file);
    // this.onAddImage(event);
  };
  //----------------------- handel button ------------------------------//
  onAddImage(baseString) {
    //--------------------------------------------------------------------//

    const base64 = baseString;
    const newEditorState = this.insertImage(this.state.editorState, base64);
    this.onChange(newEditorState);
  }
  insertImage(editorState, base64) {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      { src: base64 }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
  }

  render() {
    const popover = {
      position: 'absolute',
      zIndex: '100',
    };
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    };
    return (
      <div className=" ">
        <div>
          <div className="outerFrame">
            {inlineStyleButtons.map((button) => {
              return this.renderInlineStyleButton(
                button.value,
                button.style,
                button.icon
              );
            })}
            {blockButtons.map((button) => {
              return this.renderBlockButton(
                button.value,
                button.block,
                button.icon
              );
            })}
          </div>
          <div>
            <input
              type="button"
              className="button"
              onMouseDown={this.toggleInlineStyle.bind(this)}
              data-style="HIGHLIGHT"
              value="HIGHLIGHT"
            ></input>
            <input
              type="button"
              className="button"
              onMouseDown={this.toggleInlineStyle.bind(this)}
              data-style="textAlignment"
              value="textAlignment"
            ></input>
            <input
              type="file"
              className="inline styleButton"
              onChange={this.onChangeHandler}
            />
            {/* <i class="material-icons">image</i> */}

            {this.state.displayColorPicker ? (
              <div style={popover}>
                <div style={cover} onClick={this.handleClose} />
                <SketchPicker
                  color={this.state.background}
                  onChangeComplete={this.handleChangeComplete.bind(this)}
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className="editortextbox">
          <Editor
            plugins={plugins}
            ref={(element) => {
              this.editor = element;
            }}
            spellCheck="true"
            customStyleMap={this.state.styleMap}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand.bind(this)}
            onChange={this.onChange.bind(this)}
            keyBindingFn={this.keyBindingFunction.bind(this)}
            handlePastedText={() => true}
          />
        </div>
        <button
          className="btn btn-primary"
          // -------------------- on click convert the html into string and send it back to the content viwer ----------------//
          onClick={(e) => {
            var d = this.convertDomToHtmlString();
            console.log(this.convertHTMLStringToDom(d));

            this.props.saveTextContent(d);
          }}
        >
          حفظ
        </button>
        <button
          className="btn btn-primary"
          onClick={(e) => {
            this.props.closeEditor();
          }}
        >
          تراجع
        </button>
      </div>
    );
  }
}
export default MyEditor;
