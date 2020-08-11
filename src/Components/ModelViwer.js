import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import config from '../config.json';
import axios from 'axios';
import ModuleList from './ModuleList';
import ArticlesList from './TopicList';
import AddArticales from './AddArtile';
import ArticlesItem from './ArticleItem';
import MyList from './mylist';
import TopicControlPanel from './TopicControlPanel';
import ContentViwer from './ContentViwer';
import ModuleControlPanel from './ModuleControlePanel';
import {
  List,
  Card,
  Menu,
  Segment,
  Grid,
  Button,
  Breadcrumb,
} from 'semantic-ui-react';

import $ from 'jquery';

class MainDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      module: [],
      articales: [],
      Contents: [],
      error: false,
      isModule: true,
      isTpics: false,
      isContent: false,
      ViwerTitle: <a></a>,
      currentModel: 0,
      steps: [],
    };

    this.goToTopicsViwer = this.goToTopicsViwer.bind(this);
    this.UpdateListafterDelete = this.UpdateListafterDelete.bind(this);
    this.mapModels = this.mapModels.bind(this);
    this.ArticleOfTopic = this.ArticleOfTopic.bind(this);
    this.backToModules = this.backToModules.bind(this);
    this.goToContentViwer = this.goToContentViwer.bind(this);
  }

  //--------------------------------------------------------------------------------//
  UpdateNotification() {
    this.props.UpdateNotification();
  }

  //-------------------- Return Back To module List ----------------------------------//
  backToModules() {
    this.setState(
      {
        isModule: true,
        isTpics: false,
        isContent: false,
        articales: [],
        id: null,
        ViwerTitle: this.updateNavigator(
          JSON.parse(localStorage.getItem('navMap'))
        ),
      },
      () => {
        localStorage.setItem('CurrentNav', 'Model');
      }
    );
    localStorage.removeItem('CurrentTpic');
    this.getAllModules();
  }

  //------------------------ afunction to get all articels of a cliked Artcile ----------//
  ArticleOfTopic(e) {
    console.log(
      $('#' + e.currentTarget.id).attr('data-name'),
      ' e.currentTarget.id'
    );
    this.updateNavigator($('#' + e.currentTarget.id).attr('data-name'));
    if (localStorage.getItem('CurrentTpic') !== null) {
      $('#art' + localStorage.getItem('CurrentTpic'))
        .find('div#' + localStorage.getItem('CurrentTpic'))
        .removeClass('activeli');
    }
    $('#' + e.currentTarget.id)
      .find('div#' + e.currentTarget.id.substr(3))
      .addClass('activeli');

    var id = e.currentTarget.id;
    this.setState({
      id: parseInt(e.currentTarget.id.substr(3)),
    });
    localStorage.setItem('CurrentTpic', e.currentTarget.id.substr(3));
  }

  //-----------------------------------------------------------------------------------//
  //-------------------------------- got to the Content Page --------------------------//
  //-----------------------------------------------------------------------------------//
  goToContentViwer(Contents) {
    // console.log(Contents, this.state.Contents);

    this.setState(
      {
        model: [<div>hiiiiiiiiiiiiiii</div>],
        isModule: false,
        isTpics: false,
        isContent: true,
        Updated: false,
        Contents: Contents,
      },
      () => {
        localStorage.setItem('CurrentNav', 'Content');
        this.updateNavigator(JSON.parse(localStorage.getItem('navMap')));
      }
    );
    console.log(
      'in got to content ,',
      this.state.module,
      this.state.Contents,
      'contentsArray'
    );
  }
  //-----------------------------------------------------------------------------------//
  //-------------- a component to swich from Model Viwer to Topics Viewr --------------//
  //-----------------------------------------------------------------------------------//
  goToTopicsViwer() {
    localStorage.setItem('CurrentNav', 'Topic');
    if (JSON.parse(localStorage.getItem('navMap')).length === 3) {
      var navMap = JSON.parse(localStorage.getItem('navMap'));
      navMap.pop();
      this.updateNavigator(navMap);
    } else {
      this.updateNavigator(JSON.parse(localStorage.getItem('navMap')));
    }
    this.setState(
      {
        module: [],
        isModule: false,
        isTpics: true,
        isContent: false,
        currentModel: parseInt(localStorage.getItem('selectedModel')),
        Updated: false,
      },
      () => {}
    );

    console.log('in axios of topic');
    axios
      .get(
        '/Dashbord/getModuleTopics?ID=' + localStorage.getItem('selectedModel')
      )
      .then((result) => {
        this.setState(
          {
            module: result.data,
          },
          () => {
            console.log('module', this.state.module);
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //-------------------------------------------------------------------------------------//
  //------------------- a fnc To update the ModelList After Deleting --------------------//
  //-------------------------------------------------------------------------------------//
  UpdateListafterDelete() {
    this.setState({
      Updated: true,
    });
    this.getAllModules();
  }
  //------------------------------------ Get All Topic ------------------------------------------//
  getAllModules() {
    axios
      .get(config[0].server + 'Dashbord/getAllModules')
      .then((result) => {
        this.setState({
          module: result.data,
          ViwerTitle: ' عارض النماذج',
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          error: true,
        });
      });
  }
  //-----------------------------------------------------------------------------------------------------//
  async componentDidMount() {
    console.log(this.state.steps, 'ffffffffffff');
    if (localStorage.getItem('CurrentNav') === null) {
      await localStorage.setItem('CurrentNav', 'Model');
      console.log('addded');
      this.getAllModules();
    } else if (localStorage.getItem('CurrentNav') === 'Model') {
      this.getAllModules();
    } else if (localStorage.getItem('CurrentNav') === 'Topic') {
      this.goToTopicsViwer();
    } else if (localStorage.getItem('CurrentNav') === 'Content') {
      var ArticleItem = localStorage.getItem('selectedArticle');

      axios
        .post(config[0].server + 'Articles/getContentID', {
          ArticleID: localStorage.getItem('selectedArticle'),
        })
        .then((result) => {
          // this.props.leaveTpicToContent(result.data);
          this.goToContentViwer(result.data);
        })
        .catch((error) => {
          console.log(error);
        });
      // console.log(ArticleItem);
    }
  }

  //------------------------------------------Update Navigator -------------------------------------------//
  updateNavigator(newNode) {
    console.log('updateNavigator updateNavigatorupdateNavigator', newNode);

    if (!Array.isArray(newNode)) {
      if (localStorage.getItem('CurrentNav') === 'Model') {
        this.setState(
          {
            steps: [newNode],
          },
          () => {
            localStorage.setItem('navMap', JSON.stringify(this.state.steps));
            this.createNavPare();
          }
          //------------
        );
      } else if (localStorage.getItem('CurrentNav') === 'Topic') {
        // console.log(localStorage.getItem('CurrentNav'), 'currentNav------');
        console.log(this.state.steps, 'steps array ');
        var d = this.state.steps;
        if (d.length === 3) {
          d.pop();
        }
        d[1] = newNode;
        this.setState(
          {
            steps: d,
          },
          () => {
            localStorage.setItem('navMap', JSON.stringify(this.state.steps));
            this.createNavPare();
          }
        );
      } else if (localStorage.getItem('CurrentNav') === 'Content') {
        var d = this.state.steps;

        d[2] = newNode;
        this.setState(
          {
            steps: d,
          },
          () => {
            localStorage.setItem('navMap', JSON.stringify(this.state.steps));
            this.createNavPare();
          }
        );
      } //-------------------
    } else {
      var newArray = JSON.parse(localStorage.getItem('navMap'));
      // if (localStorage.getItem('CurrentNav') === 'Topic') {
      //   console.log(localStorage.getItem('navMap'), 'from non array');
      //   if (newArray.length === 3) {
      //     newArray.pop();
      //     localStorage.setItem('navMap', newArray);
      //     console.log(localStorage.getItem('navMap'), 'from non array');
      //   }
      // }
      this.setState(
        {
          steps: newNode,
        },
        () => {
          console.log(newNode);
          this.createNavPare();
        }
      );
    }
  }

  async naveClick(e) {
    console.log(e.target.id, 'eeeeeeeeeeeeeeee');
    if (e.target.id === '0') {
      await localStorage.setItem('CurrentNav', 'Model');

      this.getAllModules();
    } else if (e.target.id === '1') {
      await localStorage.setItem('CurrentNav', 'Topic');
      this.goToTopicsViwer();
    }
  }
  //------------------------------------ Create NavePare -------------------------------------------------//
  createNavPare() {
    console.log(this.state.steps, 'pppppppppppppppppppppp');
    const sections = this.state.steps.map((item, index) => {
      console.log(item, 'gggggggggggggggggggggggggggg');
      return {
        id: index,
        key: index,
        content: item,
        link: true,
        onClick: this.naveClick.bind(this),
      };
    });
    this.setState(
      {
        ViwerTitle: <Breadcrumb sections={sections}></Breadcrumb>,
      },
      () => {
        console.log(this.state.ViwerTitle);
      }
    );
  }
  // console.log(localStorage.getItem('CurrentNav'));

  //-------------------------------------------Get All the Modules ---------------------------------------//
  mapModels() {
    var ArrayModules = this.state.module.map((model) => {
      return (
        <ModuleList
          model={model}
          convertToTopic={this.goToTopicsViwer.bind(this)}
          updateNavigator={this.updateNavigator.bind(this)}
          UpdateListafterDelete={this.UpdateListafterDelete.bind(this)}
        />
      );
    });

    return <Card.Group>{ArrayModules} </Card.Group>;
  }

  //--------------------------- a function to get all Topic for a particulier Module ----------------------//
  mapTopics() {
    var ArrayModules = this.state.module.map((model) => {
      return (
        <Grid.Row
          key={model['TopicID']}
          id={'art' + model['TopicID']}
          data-name={model['Title']}
          onClick={this.ArticleOfTopic.bind(this)}
        >
          <Grid.Column>
            <ArticlesList
              Artical={model}
              goToTopicsViwer={this.goToTopicsViwer.bind(this)}
              updateNavigator={this.updateNavigator.bind(this)}
              currentModID={localStorage.getItem('selectedModel')}
            ></ArticlesList>
          </Grid.Column>
        </Grid.Row>
      );
    });
    ArrayModules.unshift(
      <Grid reversed="computer vertically" celled>
        <TopicControlPanel
          updateFromChild={this.goToTopicsViwer.bind(this)}
        ></TopicControlPanel>
      </Grid>
    );
    return (
      <List id="TopicList" className="border staticplace">
        {ArrayModules}
      </List>
    );
  }

  //-------------------------------------------Get All the Modules ---------------------------------------//
  mapContents() {
    return (
      <ContentViwer
        data={this.state.Contents}
        convertToTopic={this.goToTopicsViwer.bind(this)}
        updateNavigator={this.updateNavigator.bind(this)}
        UpdateListafterDelete={this.UpdateListafterDelete.bind(this)}
        UpdateNotification={this.UpdateNotification.bind(this)}
      />
    );
  }

  render() {
    var ArrayModules = [];

    //---------------------- if we are in the module Area ------------------//
    if (localStorage.getItem('CurrentNav') === 'Model') {
      ArrayModules = this.mapModels();
    } else if (localStorage.getItem('CurrentNav') === 'Topic') {
      console.log('ViwerTitle', this.state.ViwerTitle);
      // console.log(localStorage.getItem('selectedModel'));
      ArrayModules = this.mapTopics();
    } else if (this.state.isContent) {
      // console.log(localStorage.getItem('CurrentNav'));
      ArrayModules = this.mapContents();
    } else {
      console.log(localStorage.getItem('CurrentNav'));
    }

    return (
      <table style={{ width: '100%' }}>
        <div>
          <Menu attached="top" tabular>
            <Menu.Item active={true} onClick={this.handleItemClick}>
              {this.state.ViwerTitle}
              {/* {console.log(
                this.state.ViwerTitle,
                '------------------------------------'
              )} */}
            </Menu.Item>
          </Menu>
          <Segment basic>
            {this.state.error ? (
              <Segment raised>' An Error Accured Please Try later'</Segment>
            ) : (
              <div
                className="container"
                // class="tab-pane fade show active"
                id="nav-home"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
              >
                {localStorage.getItem('CurrentNav') === 'Model' ? (
                  <ModuleControlPanel
                    mapModels={this.UpdateListafterDelete.bind(this)}
                  ></ModuleControlPanel>
                ) : null}
                <div
                  className="row"
                  style={{ right: 0, left: 0, margin: 'auto' }}
                >
                  {ArrayModules.length === 0 && !this.state.isContent
                    ? 'لم يتم العثور على بيانات '
                    : ArrayModules}
                  {localStorage.getItem('CurrentNav') === 'Topic' &&
                  !this.state.isContent ? (
                    <div className="col">
                      <div className="">
                        <MyList
                          id={this.state.id}
                          backToModules={this.backToModules.bind(this)}
                          goToContentViwer={this.goToContentViwer.bind(this)}
                          updateNavigator={this.updateNavigator.bind(this)}
                        ></MyList>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </Segment>
        </div>
      </table>
    );
  }
}

export default MainDashBoard;
