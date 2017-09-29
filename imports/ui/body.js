import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
//add state dictionary to the body
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

//import task component from the body
import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  //subscribe to tasks
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  //getting tasks from the database
  tasks() {
    //add helpers to body Template
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    //otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  //add incompleteCount helper to body
  incompleteCount() {
    return Tasks.find({ checked: {$ne: true } }).count();
  },
  //hardcoding the tasks
  // tasks: [
  //   { text: 'This is task 1' },
  //   { text: 'This is task 2' },
  //   { text: 'This is task 3' },
  // ],
});

//adding event handler for form submit
Template.body.events({
  'submit .new-task'(event) {
    //Prevent default browser form submit
    event.preventDefault();
    //get info about the event
    console.log(event);
    //Get value from form element
    const target = event.target;
    const text = target.text.value;

    //replace insert with addTask method
    Meteor.call('tasks.insert', text);
    //Insert a task into the Collection
    // Tasks.insert({
    //   text,
    //   createdAt: new Date(), //current time
    //   //update insert to include user data
    //   owner: Meteor.userId(),
    //   username: Meteor.user().username,
    // });

    //clear form
    target.text.value = '';
  },
  //add event handler for checkbox
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
})
