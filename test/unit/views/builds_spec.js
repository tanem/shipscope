var ga = function() {}
describe('Builds View', function() {
  'use strict'

  var project, builds, view

  beforeEach(function() {
    project = new Project(ProjectFixtures.good)
    builds = new Builds(BuildFixtures.good)
    project.set({builds: builds})
    view = new BuildsView({collection: builds}, {projectId: project.id})
  })

  it('has a collection when it is instantiated', function() {
    view.projectId.should.equal(project.id)
  })

  it('provides the project id to its child views', function() {
    view.childViewOptions().projectId.should.equal(project.id)
  })

  describe('restarting a build', function() {
    var event
    beforeEach(function() {
      event = {
        type: 'click',
        currentTarget: {
          dataset: {
            id: project.attributes.builds.at(0).id
          }
        },
        preventDefault: function() {}
      }
    })

    afterEach(function() {
      window.ga.restore()
    })

    it('allows the user to restart the build', function() {
      var build = builds.at(0)

      sinon.stub(window, 'ga')
      sinon.stub(build, 'restart')
      view.onClick(event)

      build.restart.calledOnce.should.be.true
    })

    it('does not try to restart a nonexistent build', function() {
      event.currentTarget.dataset.id = 99999999999
      sinon.stub(window, 'ga')
      sinon.stub(console, 'warn')
      view.onClick(event)

      window.ga.called.should.be.false
      console.warn.calledOnce.should.be.true
    })
  })
})
