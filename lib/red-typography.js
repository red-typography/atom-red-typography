'use babel';

import { CompositeDisposable } from 'atom';
import Typograf from 'typograf';

export default {
  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'red-typography:process': () => this.process(),
      'red-typography:settings': () => this.settings()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  _prepareRules(str) {
     return str.split(/[,;: ]/)
       .map(rule => rule.trim())
       .filter(rule => Boolean(rule));
  },

  _getSetting(name) {
    return atom.config.get('red-typography.' + name);
  },

  settings() {
    atom.workspace.open('atom://config/packages/red-typography');
  },

  process() {
    const
      editor = atom.workspace.getActiveTextEditor(),
      tp = new Typograf({
        locale: [this._getSetting('locale'), 'en-US'],
        htmlEntity: {
            type: this._getSetting('type'),
            onlyInvisible: this._getSetting('onlyInvisible')
        },
        enableRule: this._prepareRules(this._getSetting('enableRules')),
        disableRule: this._prepareRules(this._getSetting('disableRules'))
      });

    if (editor) {
      const
        selection = editor.getSelectedText(),
        result = tp.execute(selection);

      editor.insertText(result);
    }
  }
};
