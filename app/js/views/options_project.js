var OptionsProjectView = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  className: 'list-group-item',
  template: '#option_project_item',

  templateHelpers: function() {
    return {
      isChecked: this.model.get('enabled') ? 'checked' : ''
    }
  }
})
