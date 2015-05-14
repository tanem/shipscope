var App = {
  intercom: {
    postMessage: function() {},
    onMessage: {
      addListener: function(callback) {App.callback = callback}
    }
  }
}

describe('Projects View', function() {
  'use strict'

  var should, projects, view

  before(function() {
    should = chai.should()
    sinon.stub(window, 'ga')
  })

  after(function() {
    window.ga.restore()
  })

  beforeEach(function() {
    sinon.stub(window, 'setInterval').returns(12345)
    sinon.stub(window, 'clearInterval')

    projects = new Projects([ProjectFixtures.good, ProjectFixtures.bad])
  })

  afterEach(function() {
    window.setInterval.restore()
    window.clearInterval.restore()
  })


  describe('initializing', function() {
    beforeEach(function() {
      sinon.stub(App.intercom, 'postMessage')
      sinon.spy(App.intercom.onMessage, 'addListener')

      view = new ProjectsView({collection: projects})
    })

    afterEach(function() {
      App.intercom.postMessage.restore()
      App.intercom.onMessage.addListener.restore()
    })

    it('should fetch projects on initialization', function() {
      App.intercom.postMessage.calledOnce.should.be.true
      App.intercom.postMessage.calledWithExactly({type: 'projects.get'}).should.be.true
      App.intercom.onMessage.addListener.calledOnce.should.be.true
    })

    it('ignore messages except projects.set', function() {
      App.intercom.onMessage.addListener.calledOnce.should.be.true
      App.callback.should.not.equal(undefined)

      App.callback({type: 'bobloblaw'})

    })

    it('should update the view collection when projects are fetched', function() {
      sinon.stub(view.collection, 'reset')

      App.intercom.onMessage.addListener.calledOnce.should.be.true
      App.callback.should.not.equal(undefined)

      App.callback({type: 'projects.set', data: {one: 1}})

      view.collection.reset.calledOnce.should.be.true

      view.collection.reset.restore()
    })

  })

  describe('view project', function() {
    it('should trigger project viewing when a project is clicked', function() {
      sinon.stub(Backbone.Events, 'trigger')
      var event = {
        type: 'cilck',
        currentTarget: {
          querySelector: function() {}
        }
      }
      sinon.stub(event.currentTarget, 'querySelector').returns({dataset: {id: 12345}})

      view = new ProjectsView({collection: projects})
      view.onClick(event)

      Backbone.Events.trigger.calledWithExactly('show:project', 12345).should.be.true
      event.currentTarget.querySelector.restore()
    })
  })
})
