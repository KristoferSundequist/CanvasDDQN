import Controls from './Controls';

/**
 * @property {number|Null} nextAction
 */
class ProgrammaticControls extends Controls {
  constructor() {
    super();

    this.nextAction = null;
  }

  getAction() {
    return this.nextAction;
  }

  /**
   * Set the action to be taken next.
   *
   * @param {number} action
   */
  setAction(action) {
    this.nextAction = action;
  }
}

export default ProgrammaticControls;
