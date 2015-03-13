var OptionsProjectsView = Backbone.Marionette.CollectionView.extend({
  childView: OptionsProjectView,
  emptyView: EmptyView,
  tagName: 'ul',
  className: 'projects_list',
  events: {
    'switchChange.bootstrapSwitch input[type=checkbox]': 'onSwitch'
  },

  templateHelpers: {
    msg: {
      no_projects: chrome.i18n.getMessage('no_projects')
    },
  },

  onShow: function() {
    this.$('input[type=checkbox]').bootstrapSwitch()
  },

  onSwitch: function(event, state) {
    // console.debug('event:', event.currentTarget.value)
    // console.debug('onSwitch:', state)

    // project = this.collection.get(event.currentTarget.value)
    var id = event.currentTarget.value
    var projects = this.model.get('projects')
    if (state) {
      console.debug('adding:', id)
      projects.push(id)
    } else {
      console.debug('unadding:', id)
      projects = _.without(projects, id)
    }
    this.model.set({projects: projects})
    console.debug('storing:', this.model.attributes)
    OptionsApp.intercom.postMessage({type: 'options.set', data: this.model.attributes})

    // project = this.collection.get(event.currentTarget.value)
    // if (project) {
    //   this.model.projects.
    // }
    // this.model.projects
    // OptionsApp.intercom(
  }
})
