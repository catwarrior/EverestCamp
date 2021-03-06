import {Posts, Nodes} from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {is_allowed} from '/lib/access_control';
import {validate} from '/lib/posts_publications';

export default function () {
  Meteor.methods({

    'post.insert'( post ) {
      check( post, Object );
      is_allowed('post.insert', Meteor.userId());
      validate( post );
      return Posts.insert( post );
    },

    'post.update'( post ) {

      check( post, Object );
      is_allowed('post.update', Meteor.userId());
      validate( post );

      // add history if parameter is set
      if(post.commit_history){
        post.history.push({
          date: new Date(),
          content: post.content,
          author: Meteor.user().username,
          userId: Meteor.userId(),
          title: post.title
        });
        delete post.commit_history
      }

      var postId = post._id;
      delete post._id;
      Posts.upsert( postId, { $set: post } );

      var node = Nodes.findOne({ref_id: postId});
      node.label = post.title;
      var nodeId = node._id;
      delete node._id;
      Nodes.upsert( nodeId, { $set: node } );
    },

    'post.remove'( post ){
      check( post, Object );
      is_allowed('post.remove', Meteor.userId());
      var node = Nodes.findOne({ref_id: post._id});
      if(node){
        Meteor.call('node.remove', node);
      }
      Posts.remove( post._id );
    }
  });
}
