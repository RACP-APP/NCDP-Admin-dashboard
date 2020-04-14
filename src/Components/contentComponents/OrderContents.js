import '../../css/component.css';
import axios from 'axios';
import config from '../../config.json';
import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Table } from 'semantic-ui-react';

// ---------------------------------------------- fake data generator -----------------------------------------------//
const getItems = (count, data) => {
  var d = [];
  for (var i = 0; i < data.length; i++) {
    d[i] = {
      id: `item-${i}`,
      content: CreaContent(data[i]),
      // content: `item ${data[i]['MediaType']} ${data[i]['MediaOrder']}`,
      data: data[i],
    };
  }
  return d;
};

//----------------------------------- Create Ouer Content For Viweing -------------------------------------------------//
const CreaContent = (data) => {
  // return `item ${data['MediaType']} ${data['MediaOrder']}`;

  //-------------------------------------------------- Image Conten  --------------------------------------------------//

  return (
    <Table color="blue" id={data['MediaLink']}>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <span className="ItemIcons">{data['MediaOrder']}</span>
          </Table.Cell>
          <Table.Cell>
            <span className="ItemIcons">{data['MediaType']}</span>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};
//--------------------------- a little function to help us with reordering the result----------------------------------//
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  console.log(result);
  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // --------------------------------- some basic styles to make the items look a bit nicer ------------------------------//
  userSelect: 'none',
  padding: grid * 1,
  margin: `0 0 ${2}px 0`,

  //--------------------------------------- change background colour if dragging -----------------------------------------//
  background: isDragging ? 'lightgreen' : ' #ffffff',

  //--------------------------------------- styles we need to apply on draggables -----------------------------------------//
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  minWidth: '160px',
  background: isDraggingOver ? 'lightblue' : '#fffffff',
  padding: grid,
  width: '100%',
});

class OrderContents extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.data);
    this.state = {
      items: getItems(5, this.props.data),
      Update: this.props.Update,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    //--------------------------------------- dropped outside the list ------------------------------------------------//
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }

  componentWillReceiveProps(nextprop) {
    if (nextprop.Update) {
      axios
        .post(config[0].server + 'Articles/ReOrder', {
          data: this.state.items,
        })
        .then((result) => {
          console.log('done');
          this.props.getAllContent();
          this.props.closePortal();
        })
        .catch((error) => {
          console.log(error);
          this.props.closePortal();
        });
    }
  }
  // -------------------------Normally you would want to split things out into separate components.---------------------------//
  //-------------------------- But in this example everything is just done in one place for simplicity------------------------//
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              <Table.Row>{provided.placeholder}</Table.Row>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default OrderContents;
