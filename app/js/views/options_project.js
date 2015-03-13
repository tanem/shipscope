var OptionsProjectView = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  className: 'project_selector_item',
  template: '#option_project_item',

  templateHelpers: function() {
    return {
      isChecked: this.model.get('enabled') ? 'checked' : ''
    }
  }
})
