import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import axios from 'axios';
import config from '../config.json';
import ArticlesItem from './ArticleItem';
import ArticlesControlPanel from './ArticlControlPanel';
import { Segment } from 'semantic-ui-react';

class MyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      data: [],
      updatedFromChild: false,
    };
    this.getData = this.getData.bind(this);
    this.updateFromChild = this.updateFromChild.bind(this);
    this.backToModules = this.backToModules.bind(this);
  }

  //-------------------------- return Back to Modules Panele ------------------------------------//
  backToModules() {
    this.setState({
      data: [],
      id: null,
    });

    this.props.backToModules();
  }

  getData(TopicID) {
    axios
      .post(config[0].server + 'Dashbord/ArticleOfTopic', {
        ID: parseInt(TopicID),
      })
      .then((result) => {
        this.setState({
          data: result.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  //----------------- if the compnent will recive a prop, it will compar it if its new then it will make a request to update the data --------------------------------------//
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      var TopicID = nextProps.id;
      this.setState({
        id: nextProps.id,
      });
      this.getData(TopicID);
    }
  }

  componentDidMount() {
    this.getData(this.props.id);
  }

  //-----------------------------------------------------------------------------------//
  //--------------- Update Stause from Child Component --------------------------------//
  //----------------------------------------------------------------------------------//
  updateFromChild() {
    this.getData(this.state.id);
  }
  leaveTpicToContent(contents) {
    this.props.goToContentViwer(contents);
  }
  render() {
    return (
      <div className="row border component ">
        <div className="row ">
          <Segment
            raised
            style={{
              width: '100%',
              marginTop: '22px',
              marginRight: '15px',
              marginLeft: '15px',
            }}
          >
            <ArticlesControlPanel
              updateFromChild={this.updateFromChild.bind(this)}
              backToModules={this.backToModules.bind(this)}
            />
          </Segment>
        </div>
        {this.state.data.length === 0 ? (
          <div className="row ItemTitle">لم يتم العثور على بيانات</div>
        ) : (
          <div className="row">
            {this.state.data.map((item) => {
              return (
                <ArticlesItem
                  data={item}
                  updateFromChild={this.updateFromChild.bind(this)}
                  leaveTpicToContent={this.leaveTpicToContent.bind(this)}
                ></ArticlesItem>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
export default MyList;
