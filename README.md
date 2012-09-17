## Ember.I18n

Internationalization for Ember

### Requirements
At a mininum you set `Em.I18n.locale.en` to an object containing your translation
information (typically English). If you want to support inflection based on `count`, you will
also need to include the
[CLDR.js pluralization library](https://github.com/jamesarosen/CLDR.js)
and set `CLDR.defaultLocale` to the current locale code (e.g. "de").

Additionally by defining translation keys `Em.I18n.locale[someLocale]` and doing

    Em.I18n.set('currentLocale', someLocale);

then the translated content is updated on the fly, using the `{{tt someKey}}` helper. For example,

    Em.I18n.locale.en = {
      'best': 'best'
    }

    Em.I18n.locale.el = {
       'best': 'καλύτερο'
    } 

    {{tt best}}

will get the correct key and render the translation. If `Em.I18n.currentLocale` is changed after render, the template
is updated with the new translated content.


### Best practices
  * Define each dictionary `Em.I18n.locale.de`, `Em.I18n.locale.ru`, etc in its own file `{root_app}/config/locales/{language}.js`

  * Make sure you use the `{{tt key}}` helper instead of `{{t key}}` if you want to enable translation keys bindings and switch language on the fly.

  * Let the user switch language by setting `Em.I18n.currentLocale`. Example:

    changeLanguage: function(event, lang) {
      Em.I18n.set('currentLocale', lang);
    }

So here the proced, Define locale dictionaries in '{root_app}/config/locales/{language}.js'. 

### Examples

Given

    Em.I18n.locale.en = {
      'user.edit.title': 'Edit User',
      'user.followers.title.one': 'One Follower',
      'user.followers.title.other': 'All {{count}} Followers',
      'button.add_user.title': 'Add a user',
      'button.add_user.text': 'Add',
      'button.add_user.disabled': 'Saving...'
    };

#### A simple translation:

    <h2>{{t user.edit.title}}</h2>

yields

    <h2><span id="i18n-123">Edit User</span></h2>

#### Remove the `span` by specifying a `tagName`:

    {{t user.edit.title tagName="h2"}}

yields

    <h2 id="i18n-123">Edit User</h2>

#### Set interpoloated values directly:

    <h2>{{t user.followers.title count="2"}}</h2>

yields

    <h2><span id="i18n-123">All 2 Followers</span></h2>

#### Bind interpolated values:

    <h2>{{t user.followers.title countBinding="user.followers.count"}}</h2>

yields

    <h2><span id="i18n-123">All 2 Followers</span></h2>

if `user.getPath('followers.count)` returns `2`.

#### Translate attributes in a view:

Add the mixin `Em.Button.reopen.call(Em.Button, Em.I18n.TranslateableAttributes)` and use like this:


    {{#view Em.Button titleTranslation="button.add_user.title">
      {{t button.add_user.text}}
    {{/view}}

yields

    <button title="Add a user">
      Add
    </button>

#### Translate attributes on a plain tag:

    <a {{translateAttr title="button.add_user.title"
                        data-disable-with="button.add_user.disabled"}}>
      {{t button.add_user.text}}
    </a>

yields

    <a title="Add a user" data-disable-with="Saving...">
      Add
    </a>

#### 

### Limitations

 * There is no way to pass interpolations to attribute translations. I can't
   think of a syntax to support this. It *might* be possible to look up
   interpolations from the current context.
 * All `Em.I18n.locale` language dictionaries **must** be fully populated before Ember
   renders any views. There are no bindings on the translations themselves,
   so Ember will not know to re-render views when translations change.
