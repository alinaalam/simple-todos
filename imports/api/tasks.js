import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

//add publication for tasks
if (Meteor.isServer) {
  //this code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    //only publish tasks the user is allowed to see
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

//defining some methods
Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);

    //Make sure the user is logged in before inserting a task
    if ( !Meteor.userId() ) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },

  'tasks.remove'(taskId) {
    check(taskId, String);

    const task = Tasks.findOne(taskId);
    //add some extra security to methods
    if (task.private && task.owner !== Meteor.userId()) {
      //if the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    // //changing the above code to make sure only the owner can delete their task
    // if(task.owner !== Meteor.userId()) {
    //   throw new Meteor.Error('not-authorized');
    // }
    Tasks.remove(taskId);
  },

  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  //define method to set tasks to private
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    //Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  }
});
