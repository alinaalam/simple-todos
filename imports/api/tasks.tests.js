/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Tasks } from './tasks.js';

//add a scaffold for a method test
if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      //prepare the database for each test
      const userId = Random.id();
      let taskId;

      beforeEach(() => {
        Tasks.remove({});
        taskId = Tasks.insert({
          text: 'test task',
          createdAt: new Date(),
          owner: userId,
          username: 'tmeasday',
        });
      });

      it('can delete owned task', () => {
        //added test to check delete method
        //find the internal implementation of the task method so we can test it in isolation
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];

        //set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        //run the method with 'this' set to the fake invocation
        deleteTask.apply(invocation, [taskId]);

        //verify that the method does what we expected
        assert.equal(Tasks.find().count(), 0);
      });
    });
  });
}
