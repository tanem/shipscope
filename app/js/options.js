Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
  return Handlebars.compile(rawTemplate);
}

var OptionsApp = new Marionette.Application(),
  cacheTemplates = function() {
    Backbone.Marionette.TemplateCache.get('#options_layout')
    Backbone.Marionette.TemplateCache.get('#option_projects_list')
    Backbone.Marionette.TemplateCache.get('#option_project_item')
    Backbone.Marionette.TemplateCache.get('#empty_projects_view')
  },

  openIntercom = function() {
    OptionsApp.intercom = chrome.extension.connect({name: "shipscope intercom"})

    if (OptionsApp.intercom) {
      OptionsApp.main.show(new OptionsLayout())
    } else {
      console.error('Could not get the intercom.')
    }
  }

OptionsApp.addRegions({
  main: 'body'
})

OptionsApp.addInitializer(cacheTemplates);
OptionsApp.addInitializer(openIntercom);

OptionsApp.on('initialize:after', function() {
  Backbone.history.start({pushState: true})
})

OptionsApp.start()

