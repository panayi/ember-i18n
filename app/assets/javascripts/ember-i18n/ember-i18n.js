// Generated by CoffeeScript 1.4.0
(function() {
  var I18n, findTemplate, get, isBinding, isTranslatedAttribute, pluralForm, setupTranslateableAttributes;

  isTranslatedAttribute = /(.+)Translation$/;

  get = Ember.Handlebars.get || Ember.get;

  if (typeof CLDR !== "undefined" && CLDR !== null) {
    pluralForm = CLDR.pluralForm;
  }

  if (pluralForm == null) {
    Ember.Logger.warn("CLDR.pluralForm not found. Em.I18n will not support count-based inflection.");
  }

  findTemplate = function(key, setOnMissing) {
    var locale, parts, result, translations;
    Ember.assert("You must provide a translation key string, not %@".fmt(key), typeof key === "string");
    locale = I18n.get("currentLocale");
    parts = key.split(".");
    if (parts && I18n.get("locales")[parts[0]]) {
      locale = parts[0];
      key = parts.slice(1).join(".");
    }
    translations = I18n.get("locales")[locale];
    Ember.assert("Dictionary Ember.I18n.locale." + locale + " for locale " + locale + " is not set", translations);
    result = translations[key];
    if (!(setOnMissing ? result != null : void 0)) {
      result = translations[key] = I18n.compile("Missing translation: " + key);
    }
    if ((result != null) && !$.isFunction(result)) {
      result = translations[key] = I18n.compile(result);
    }
    return result;
  };

  setupTranslateableAttributes = function() {
    var attribute, isTranslatedAttributeMatch, key, path;
    this._translateableAttributes = [];
    for (key in this) {
      path = this[key];
      isTranslatedAttributeMatch = key.match(isTranslatedAttribute);
      if (isTranslatedAttributeMatch) {
        attribute = isTranslatedAttributeMatch[1];
        this._translateableAttributes.pushObject({
          attribute: attribute,
          path: path
        });
      }
    }
    return this.translateAttributes();
  };

  I18n = Ember.Object.create({
    currentLocale: "default",
    locales: {},
    compile: Handlebars.compile,
    translations: {},
    template: function(key, count) {
      var interpolatedKey, result, suffix;
      if ((count != null) && (pluralForm != null)) {
        suffix = pluralForm(count);
        interpolatedKey = "%@.%@".fmt(key, suffix);
        result = findTemplate(interpolatedKey, false);
      }
      if (result != null) {
        return result;
      } else {
        return result = findTemplate(key, true);
      }
    },
    t: function(key, context) {
      var template;
      if (context == null) {
        context = {};
      }
      template = I18n.template(key, context.count);
      return template(context);
    },
    TranslateableAttributes: Em.Mixin.create({
      didInsertElement: function() {
        var result;
        result = this._super.apply(this, arguments);
        this.setupTranslateableAttributes();
        return result;
      },
      setupTranslateableAttributes: setupTranslateableAttributes,
      translateAttributes: (function() {
        var $this, translateableAttributes;
        $this = this.$();
        if (!this._translateableAttributes) {
          this.setupTranslateableAttributes();
        }
        translateableAttributes = this._translateableAttributes;
        return translateableAttributes.forEach(function(hash) {
          if (hash.attribute && hash.path) {
            return $this.attr(hash.attribute, I18n.t(hash.path));
          }
        });
      }).observes("Ember.I18n.currentLocale")
    }),
    TranslateableProperties: Em.Mixin.create({
      init: function() {
        this.setupTranslateableAttributes();
        return this._super();
      },
      setupTranslateableAttributes: setupTranslateableAttributes,
      translateAttributes: (function() {
        var currentLocale, translateableAttributes, translations;
        translateableAttributes = this._translateableAttributes;
        currentLocale = I18n.get("currentLocale");
        translations = I18n.get("locales")[currentLocale];
        return translateableAttributes.forEach((function(prop) {
          if (prop.attribute && prop.path) {
            return this.set(prop.attribute, translations[prop.path]);
          }
        }), this);
      }).observes("Ember.I18n.currentLocale")
    })
  });

  Em.I18n = I18n;

  Ember.I18n = I18n;

  isBinding = /(.+)Binding$/;

  Handlebars.registerHelper("t", function(key, options) {
    var attrs, context, elementID, result, tagName, view;
    context = this;
    attrs = options.hash;
    view = options.data.view;
    tagName = attrs.tagName || "span";
    delete attrs.tagName;
    elementID = "i18n-" + (jQuery.uuid++);
    Em.keys(attrs).forEach(function(property) {
      var bindPath, currentValue, invoker, isBindingMatch, observer, propertyName;
      isBindingMatch = property.match(isBinding);
      if (isBindingMatch) {
        propertyName = isBindingMatch[1];
        bindPath = attrs[property];
        currentValue = get(context, bindPath);
        attrs[propertyName] = currentValue;
        invoker = null;
        observer = function() {
          var elem, newValue;
          newValue = get(context, bindPath);
          elem = view.$("#" + elementID);
          if (elem.length === 0) {
            Em.removeObserver(context, bindPath, invoker);
            return;
          }
          attrs[propertyName] = newValue;
          return elem.html(I18n.t(key, attrs));
        };
        invoker = function() {
          return Em.run.once(observer);
        };
        return Em.addObserver(context, bindPath, invoker);
      }
    });
    result = "<%@ id=\"%@\">%@</%@>".fmt(tagName, elementID, I18n.t(key, attrs), tagName);
    return new Handlebars.SafeString(result);
  });

  Handlebars.registerHelper("translateAttr", function(options) {
    var attrs, result;
    attrs = options.hash;
    result = [];
    Em.keys(attrs).forEach(function(property) {
      var translatedValue;
      translatedValue = I18n.t(attrs[property]);
      return result.push("%@=\"%@\"".fmt(property, translatedValue));
    });
    return new Handlebars.SafeString(result.join(" "));
  });

  Handlebars.registerHelper("tt", function(key, options) {
    var view;
    options.hash.keyBinding = key;
    options.hash.languageBinding = "Ember.I18n.currentLocale";
    view = Ember.View.extend({
      tagName: "span",
      template: Ember.Handlebars.compile("{{view.formattedContent}}"),
      formattedContent: (function() {
        var language;
        key = this.get("key") || key;
        language = this.get("language");
        if (key) {
          return Ember.Handlebars.helpers.t.call(this, language + "." + key, options);
        }
      }).property("key", "language")
    });
    return Ember.Handlebars.helpers.view.call(this, view, options);
  });

}).call(this);
