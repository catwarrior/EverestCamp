import React from 'react';
import moment from 'moment';
import { Alert, GridRow, ContentEditable, GridColumn, Button, FormControl, Modal, FullscreenViewer, ListGroup } from '../../bootstrap/components/index.jsx';
import { MarkdownEditor } from '../../files/containers';

export default class NodeEdit extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      shouldChildComponentUpdate: false,
      showDeleteModal: false
    };
  };

  update(event, commit_history){
    var post = this.props.post;
    if(commit_history){
      post.commit_history = commit_history;
    }
    if(event.target && event.target.type && event.target.type == 'checkbox'){
      post[event.target.name] = Boolean(event.target.checked);
    }else if(event.target){
      post[event.target.name] = event.target.value;
    }
    this.props.update(post);
  }

  remove(event){
    this.props.remove(this.props.post);
    this.toggleModal();
  }

  toggleDeleteModal(event){
    this.setState({showDeleteModal: !this.state.showDeleteModal});
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      shouldChildComponentUpdate: nextProps.postId != this.props.postId
    });
  }

  renderHistoryList(){
    var history = _.sortBy(this.props.post.history, 'date').reverse();
    var posts = history.map((post) => {
      return {_id: history.indexOf(post), label: post.title + " by " + post.author + " on " + moment(post.date).format('MMMM Do YYYY, h:mm:ss a')};
    });
    return (<ListGroup items={posts} />);
  }

  render(){
    const post = this.props.post;
    if(!post){return (<Alert style="warning">Post not found.</Alert>);}
    return(
      <GridRow className="post-edit">
        <GridColumn className="col-sm-12">
          <ContentEditable
            name="title"
            focus={true}
            text={ post.title }
            tagName="h4"
            className="page-header"
            disabled={false}
            shouldComponentUpdate={this.state.shouldChildComponentUpdate}
            onChange={ this.update.bind(this) } />
          <p></p>
          <FormControl
            style="checkbox"
            name="public"
            label="Public"
            defaultValue={post.public}
            onChange={ this.update.bind(this) } />
          <p></p>
          <FullscreenViewer>
            <MarkdownEditor
              name="content"
              text={post.content}
              onChange={this.update.bind(this)} />
           </FullscreenViewer>
           <p></p>
          <p>
            <Button onClick={this.update.bind(this, true)} style="success">Commit</Button>
          </p>
          <p>
            <Button onClick={this.toggleDeleteModal.bind(this)} style="danger">Delete</Button>
          </p>
          <Modal
            showModal={this.state.showDeleteModal}
            title="Confirm"
            onCancel={this.toggleDeleteModal.bind(this)}
            cancelLabel="Cancel"
            onConfirm={this.remove.bind(this)}
            confirmLabel="Delete">
            <p>Please confirm the deletion of post: {post.title}</p>
          </Modal>
          <h4>History</h4>
          {this.renderHistoryList()}
        </GridColumn>
      </GridRow>
    );
  }

  componentDidUpdate(){
    this.state.shouldChildComponentUpdate = false;
  }
}
