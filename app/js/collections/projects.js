var Projects = Backbone.Collection.extend({
  model: Project,
  apiKey: null,
  comparator: function(project) {
    if (project.getStatus().status == Build.STATES.testing) {
      return 0
    }
    return 1
  },

  initialize: function(models, options) {
    if (options) {
      apiKey = options.apiKey;
    }
  },

  getSummary: function() {
    var highState = {state: 0, count: 0}
    this.each(function(item, index, list) {
      var status = item.getStatus()
      if (status.status > highState.state) {
        highState.state = status.status
        highState.count = 1
      } else if (status.status == highState.state) {
        highState.count += 1
      }
    })
    return highState
  },

  setSelectedProjects: function(selectedProjects) {
    if (!selectedProjects || selectedProjects.length == 0) {
      this.each(function(project) { project.set({enabled: true}) })
      return
    }

    var that = this
    _.each(selectedProjects, function(projectId) {
      project = that.get(projectId)
      project.set({enabled: true})
    })
  },
});
