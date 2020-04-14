// import React from 'react';
import '../../css/component.css';
// import { Editor } from 'react-draft-wysiwyg';
// import {
//   EditorState,
//   getDefaultKeyBinding,
//   KeyBindingUtil,
//   convertToRaw,
//   Modifier,
//   ContentBlock,
//   EditorBlock,
//   AtomicBlockUtils,
//   RichUtils
// } from 'draft-js';

// import { stateToHTML } from 'draft-js-export-html';
// import { stateFromHTML } from 'draft-js-import-html';
// import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// //---------------------------Editor Class start --------------------------//

// // let contentState = stateFromHTML(html);
// let contentState = stateFromHTML('<p>Hello</p>');

// class MyEditor extends React.Component {
//   constructor(props) {
//     super(props);
//     //-------define number of function and bind it to the component -----//
//     this.state = {
//       HTMLContent: '',
//       editorState: EditorState.createEmpty(),
//       EditMod: false
//     };
//   }

//   // // add a new Block//
//   // inserNewBlockToContentState(contenState) {
//   //   const getCurrentContent = this.state.editorState.getCurrentContent();
//   //   console.log(getCurrentContent);
//   //   const selection = this.state.editorState.getSelection();
//   //   const textWithEntity = Modifier.splitBlock(getCurrentContent, selection);
//   //   const newBlock = new ContentBlock({
//   //     key: 'table',
//   //     text: '',
//   //     type: 'unstyled'
//   //   })();
//   //   //-----------------
//   //   const newBlockMap = blockMap
//   //     .toSeq()
//   //     .concat([[newBlock.getKey(), newBlock]])
//   //     .toOrderedMap();

//   //   //-------------------------
//   //   this.setState({
//   //     editorState: EditorState.push(
//   //       this.state.editorState,
//   //       textWithEntity,
//   //       newBlockMap
//   //     )
//   //   });
//   //   // const newBlock = new new ContentBlock({
//   //   // key: genKey(),
//   //   //     text: '',
//   //   //     type: 'unstyled'
//   //   //   })();
//   //   //   const newBlockMap = blockMap
//   //   //     .toSeq()
//   //   //     .concat([[newBlock.getKey(), newBlock]])
//   //   //     .toOrderedMap();
//   //   //   return contenState.merge({
//   //   //     blockMap: newBlockMap
//   //   //   });
//   //   //   //return
//   // }
//   onEditorStateChange = editorState => {
//     console.log(editorState.getCurrentContent(), '55555555555555');
//     console.log(stateToHTML(editorState.getCurrentContent()));

//     this.state.HTMLContent = stateToHTML(editorState.getCurrentContent());
//     // const contentState = editorState.getCurrentContent();
//     // this.inserNewBlockToContentState(editorState.getCurrentContent());
//     // console.log('content state', contentState);
//     this.setState({
//       editorState
//     });
//   };
//   //-------define number of function and bind it to the component -----//
//   // this.onChange = editorState => {
//   // this.state.HTMLContent = stateToHTML(editorState.getCurrentContent());

//   // const contentState = editorState.getCurrentContent();

//   // console.log('content state', convertToRaw(contentState));
//   // this.setState({ editorState });
//   // };
//   // }

//   componentWillReceiveProps(nextpreps) {
//     //   console.log('55555555555currenttext');
//     let contentState = null;
//     if (
//       nextpreps.data !== null &&
//       nextpreps.data !== '' &&
//       nextpreps.data !== undefined
//     ) {
//       contentState = stateFromHTML(nextpreps.data);
//       //----------------- puting the next state to the editor -------------//
//       this.setState({
//         EditMod: true,
//         editorState: EditorState.createWithContent(contentState)
//       });
//     } else {
//       contentState = stateFromHTML('<div>Welecom Back to Ouer Editor</div>');
//       console.log(nextpreps.data, 'currenttext');
//       this.setState({
//         EditMod: false,
//         editorState: EditorState.createWithContent(contentState)
//       });
//     }
//   }

//   //-------------------------------------------------------------------------------------------------//
//   //--------------------this function takes the target of the event ---------------------------------//
//   //----------------and then get the data-style attributes from it then -----------------------------//
//   //------------------------give it to the togelefunction of the editor -----------------------------//
//   //-------------------------------------------------------------------------------------------------//

//   componentDidMount() {
//     let contentState = stateFromHTML('<p>Hello</p>');
//     this.setState({ editorState: EditorState.createWithContent(contentState) });
//   }

//   //------------- Func to convet Dom to string ----------------------------//
//   convertDomToHtmlString() {
//     // stateToHTML(this.state.editorState.contentState);
//     // console.log(stateToHTML(this.state.editorState.contentState));
//     return this.state.HTMLContent.toString()
//       .trim()
//       .replace(/\\/g, '\\\\')
//       .replace(/"/g, '\\"')
//       .replace(/[\n\r]/g, '\\n');
//   }

//   //------------------- a Func to convert string to HTML -------------------//
//   convertHTMLStringToDom(data) {
//     var dom = data.replace('/', '\\');
//     // var dom = new DOMParser().parseFromString(data, 'text/html');
//     return dom;
//   }

//   //--------------------rendering function --------------------------------//
//   insertBlock = () => {
//     const { editorState } = this.state.editorState;
//     console.log(editorState);

//     const contentState = this.state.editorState.getCurrentContent();

//     const contentStateWithEntity = contentState.createEntity(
//       'CANVAS',
//       'MUTABLE',
//       { a: 'b' }
//     );

//     const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
//     const newEditorState = EditorState.set(this.state.editorState, {
//       currentContent: contentStateWithEntity
//     });

//     this.setState({
//       editorState: AtomicBlockUtils.insertAtomicBlock(
//         newEditorState,
//         entityKey,
//         ' '
//       )
//     });
//   };

//   blockRenderer = block => {
//     const { editorState } = this.state;
//     const content = this.state.editorState.getCurrentContent();

//     // const entity = content.getEntity(entityKey);

//     if (block.getType() === 'unstyled') {
//       console.log('0000000000000');
//       const entityKey = block.getEntityAt(0);
//       const entity = content.getEntity(entityKey);

//       if (entity != null && entity.getType() === 'CANVAS') {
//         console.log('55555555555555');
//         // return {
//         //   component: this.Component,

//         //   props: {
//         //     foo: 'bar'
//         //   }
//         // };
//       }
//     }
//   };

//   Component = props => {
//     // const { block, contentState, blockProps } = props;
//     // const data = contentState.getEntity(block.getEntityAt(0)).getData();

//     // console.log(props, data, blockProps);

//     return (
//       <table style={{ border: '1px solid #f00' }}>
//         <tr>
//           <EditorBlock {...props} />
//         </tr>
//       </table>
//     );
//   };
//   render() {
//     // const { editorState } = this.state.editorState;

//     return (
//       <div className="  editor">
//         <div className="editortextbox">
//           <button onClick={this.insertBlock}>Insert block</button>

//           <Editor
//             blockRendererFn={this.blockRenderer}
//             editorState={this.state.editorState}
//             onEditorStateChange={this.onEditorStateChange.bind(this)}
//             toolbarClassName="toolbarClassName"
//             wrapperClassName="wrapperClassName"
//             editorClassName="editorClassName"
//           />
//         </div>
//         {this.state.EditMod ? (
//           <button
//             className="btn btn-primary"
//             // -------------------- on click convert the html into string and send it back to the content viwer ----------------//
//             onClick={e => {
//               var d = this.convertDomToHtmlString();
//               console.log(d);

//               this.setState(
//                 {
//                   EditMod: false
//                 },
//                 () => {
//                   this.props.closeEditor();

//                   this.props.UpdateTextContent(d);
//                 }
//               );
//             }}
//           >
//             Update
//           </button>
//         ) : (
//           <button
//             className="btn btn-primary"
//             // -------------------- on click convert the html into string and send it back to the content viwer ----------------//
//             onClick={e => {
//               var d = this.convertDomToHtmlString();

//               console.log(e, '-----------------------');

//               this.props.saveTextContent(d);
//             }}
//           >
//             save
//           </button>
//         )}
//         <button
//           className="btn btn-primary"
//           onClick={e => {
//             // let contentState = stateFromHTML('<p>Hello</p>');
//             // EditorState.createWithContent(contentState);
//             this.setState({
//               EditMod: false
//             });
//             this.props.closeEditor();
//           }}
//         >
//           cancele
//         </button>
//       </div>
//     );
//   }
// }
// export default MyEditor;

import React, { Component } from 'react';
import CKEditor from 'ckeditor4-react';

// const editorConfiguration = {
//   removePlugins: ['ImageUpload']
//   // addPlugins: ["InlineEditor"]
// };
class editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: '',
      EditMod: false,
    };
  }

  //------------- Func to convet Dom to string ----------------------------//
  convertDomToHtmlString() {
    console.log(this.state.editorState);
    return this.state.editorState
      .toString()
      .trim()
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/[\n\r]/g, '\\n');
  }

  //------------------- a Func to convert string to HTML -------------------//
  convertHTMLStringToDom(data) {
    var dom = data.replace('//', '\\');
    // var dom = new DOMParser().parseFromString(data, 'text/html');
    return dom;
  }

  componentWillReceiveProps(nextpreps) {
    //   console.log('55555555555currenttext');
    let contentState = null;
    if (
      nextpreps.data !== null &&
      nextpreps.data !== '' &&
      nextpreps.data !== undefined
    ) {
      contentState = nextpreps.data;
      console.log(contentState);
      //----------------- puting the next state to the editor -------------//
      this.setState({
        EditMod: true,
        editorState: this.convertHTMLStringToDom(contentState),
      });
    } else {
      contentState = '<div>مرحبًا بعودتك إلى محررنا</div>';
      console.log(nextpreps.data, 'currenttext');
      this.setState({
        EditMod: false,
        editorState: this.convertHTMLStringToDom(contentState),
      });
    }
  }

  componentDidMount() {
    let contentState = '<p>مــــرحبــا</p>';
    this.setState({ editorState: contentState });
  }
  render() {
    return (
      <div className="  editor">
        <div className="editortextbox">
          <CKEditor
            style={{ height: '100%' }}
            onChange={(e) => {
              this.setState(
                {
                  editorState: e.editor.getData(),
                },
                () => {
                  console.log(this.state.editorState);
                }
              );
            }}
            data={this.state.editorState}
          />

          {this.state.EditMod ? (
            <button
              className="btn btn-primary"
              // -------------------- on click convert the html into string and send it back to the content viwer ----------------//
              onClick={(e) => {
                console.log();
                var d = this.convertDomToHtmlString();
                console.log(this.convertHTMLStringToDom(d));

                this.setState(
                  {
                    EditMod: false,
                  },
                  () => {
                    this.props.closeEditor();
                    console.log(this.state.editorState);
                    this.props.UpdateTextContent(d);
                  }
                );
              }}
            >
              تعديل
            </button>
          ) : (
            <button
              className="btn btn-primary"
              // -------------------- on click convert the html into string and send it back to the content viwer ----------------//
              onClick={(e) => {
                var d = this.convertDomToHtmlString();
                console.log(this.d);
                this.props.saveTextContent(d);
              }}
            >
              حفظ
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={(e) => {
              // let contentState = stateFromHTML('<p>Hello</p>');
              // EditorState.createWithContent(contentState);
              this.setState({
                EditMod: false,
              });
              this.props.closeEditor();
            }}
          >
            تراجع
          </button>
        </div>
      </div>
    );
  }
}
export default editor;
