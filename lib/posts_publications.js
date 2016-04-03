import {Posts} from '/lib/collections';
import {check} from 'meteor/check';

export function validate( post ){};

export function posts_search(filterText){
  check(filterText, String);

  var options = {sort: {updated: -1}, limit: 20}
  var selector = {$or: [
    {title: {$regex: filterText}},
    {content: {$regex: filterText}}
  ]};

  return Posts.find(selector, options);
};

export function posts_list(selector, options) {
  check(selector, Match.Optional(Object));
  check(options, Match.Optional(Object));

  if(!selector){
    const selector = {};
  }
  if(!options){
    const options = {sort: {updated: -1}};
  }
  return Posts.find(selector, options);
};

export function posts_single(postId) {
  check(postId, String);
  const selector = {_id: postId};
  return Posts.find(selector);
};