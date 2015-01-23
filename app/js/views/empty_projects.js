var EmptyView = Backbone.Marionette.ItemView.extend({
  template: '#empty_projects_view',
  templateHelpers: {
    msg: {
      no_projects: chrome.i18n.getMessage('no_projects')
    }
  }
})
