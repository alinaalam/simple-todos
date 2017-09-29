//add event handlers for Task buttons
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// import { Tasks } from '../api/tasks.js';

import './task.html';

//define helper to check ownership
Template.task.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  }
});

Template.task.events({
  'click .toggle-checked'() {
    //replace update and remove with methods
    Meteor.call('tasks.setChecked', this._id, !this.checked);
    //set the checked property to the opposite of its current value
    // Tasks.update(this._id, {
    //   $set: {checked: ! this.checked },
    // });
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
    // Tasks.remove(this._id);
  },
  //add event handler to call the setPrivate method
  'click .toggle-private'() {
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },
});
