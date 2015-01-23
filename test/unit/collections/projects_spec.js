describe('Projects', function() {
  'use strict'
  var projects

  beforeEach(function() {
    projects = new Projects([ProjectFixtures.good, ProjectFixtures.bad])
  })

  it('loads both projects correctly', function() {
    projects.length.should.equal(2)
  })

  describe('status', function() {
    it('summarizes all projects, including a bad build', function() {
      var status = projects.getSummary()
      status.should.eql({count: 1, state: Build.STATES.error})
    })

    it('summarizes all projects, including only a good build', function() {
      projects = new Projects([ProjectFixtures.good, ProjectFixtures.good2])
      var status = projects.getSummary()
      status.should.eql({count: 2, state: Build.STATES.success})
    })

    it('summarizes all projects, including testing build', function() {
      projects = new Projects([ProjectFixtures.good, ProjectFixtures.testing])
      var status = projects.getSummary()
      status.should.eql({count: 1, state: Build.STATES.testing})
    })
  })

  describe('setSelectedProjects', function() {
    it('enables all projects if elected projects is null', function() {
      projects.setSelectedProjects()
      projects.at(0).get('enabled').should.eql(true)
      projects.at(1).get('enabled').should.eql(true)
    })

    it('enables all projects if there are no selected projects', function() {
      projects.setSelectedProjects([])
      projects.at(0).get('enabled').should.eql(true)
      projects.at(1).get('enabled').should.eql(true)
    })

    it('enables projects from an array of selected projects', function() {
      projects.setSelectedProjects([9999])
      projects.at(0).get('enabled').should.eql(true)
      should.not.exist(projects.at(1).get('enabled'))
    })
  })
})

