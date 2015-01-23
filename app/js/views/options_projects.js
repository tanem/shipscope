var OptionsProjectsView = Backbone.Marionette.CollectionView.extend({
  childView: OptionsProjectView,
  emptyView: EmptyView,
  className: 'projects_list',

  template: '#option_projects_list',

  templateHelpers: {
    msg: {
      no_projects: chrome.i18n.getMessage('no_projects')
    },
  },

  onShow: function() {
    this.$('input[type=checkbox]').bootstrapSwitch()
  }
})
