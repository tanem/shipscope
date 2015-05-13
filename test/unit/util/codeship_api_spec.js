describe('Codeship API', function() {
  'use strict'
  var api

  beforeEach(function() {
    api = new CodeshipApi()
  })

  it('provides functions for fetching projects and builds', function() {
    api.fetchAll.should.not.equal(undefined)
    api.fetchBuilds.should.not.equal(undefined)
    api.fetchProjects.should.not.equal(undefined)
  })

  it('fetches projects and each build of a project')
  it('fetches builds for a project')
  it('fetches all projects')

  it('does not fetch projects without an api key')
  it('does not fetch build details without an api key')

  it('returns an error when fetching projects with an invalid api key')
  it('returns an error when fetching builds with an invalid api key')
})
