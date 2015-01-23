describe('Options', function() {
  'use strict'
  var options

  beforeEach(function() {
    options = new OptionsModel()
  })

  it('should have an empty default api_key', function() {
    options.get('api_key').should.equal('')
  })

  it('should indicate an empty api key', function() {
    options.isEmptyApiKey().should.equal(true)
  })

})
