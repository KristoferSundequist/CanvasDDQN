/**
 * @property {number} width
 * @property {number} height
 */
class Settings {
  constructor(params = {}) {
    const defaults = this.getDefaultSettings();
    Object.keys(defaults).map(key => {
      this[key] = defaults[key];
    });

    Object.keys(params).map(key => {
      this[key] = params[key];
    });
  }

  /**
   * Get the default settings. When implementing settings for own game, override
   * this method and add your defaults to be returned here.
   *
   * @returns {object}
   */
  getDefaultSettings() {
    return {
      width: 100,
      height: 100,
    };
  }
}

export default Settings;
