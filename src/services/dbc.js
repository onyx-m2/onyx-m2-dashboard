/**
 * Data access class to navigate DBC files, with fast lookup by slug, id, and mnemonic.
 */
export default class DBC {

  /**
   * Construct a DBC object using the specified pre-loaded data.
   * @param {Array} categories The message categories to associate with messages
   * @param {Object} definitions The parsed json data containing the message and signal definitions
   */
  constructor(categories, definitions) {
    this.categories = categories
    this.definitions = definitions

    // indexes
    this.messageById = {}
    this.messageBySlug = {}
    this.messageByMnemonic = {}
    this.signalByMnemonic = {}
    this.definitions.messages.forEach(m => this.indexMessage(m))
  }

  /**
   * Add a message to the DBC definitions, and have it get indexed.
   * @param {Object} message A message definition
   */
  addMessage(message) {
    if (!this.getMessageFromId(message.id)) {
      this.definitions.messages.push(message)
      this.indexMessage(message)
    }
  }

  /**
   * Get the message that matches the specified category and message slugs.
   * @param {String} categorySlug
   * @param {String} messageSlug
   */
  getMessageFromPath(categorySlug, messageSlug) {
    return this.messageBySlug[categorySlug + '/' + messageSlug]
  }

  /**
   * Get the message that matches the specified id.
   * @param {Number} id
   */
  getMessageFromId(id) {
    return this.messageById[id]
  }

  /**
   * Get the message that matches the specified mnemonic.
   * @param {String} mnemonic
   */
  getMessage(mnemonic) {
    return this.messageByMnemonic[mnemonic]
  }

  /**
   * Get the signal that matches the specified mnemonic.
   * @param {String} mnemonic
   */
  getSignal(mnemonic) {
    return this.signalByMnemonic[mnemonic]
  }

  /**
   * Get all the categories.
   */
  getCategories() {
    return this.categories
  }

  /**
   * Get the first category.
   */
  getFirstCategory() {
    return this.categories[0]
  }

  /**
   * Get the  category that matches the specified slug.
   * @param {String} slug
   */
  getCategory(slug) {
    return this.categories.find(c => c.path === slug)
  }

  /**
   * Get the first message of the category that matches the specified slug.
   * @param {String} slug
   */
  getFirstCategoryMessage(slug) {
    return this.definitions.messages.find(m => m.category === slug)
  }

  /**
   * Get the messages that match the category of the specified slug.
   * @param {String} slug
   */
  getCategoryMessages(slug) {
    return this.definitions.messages.filter(m => m.category === slug)
  }

  /**
   * Get all the signals of the message that matches the specified mnemonic.
   * @param {String} mnemonic
   */
  getMessageSignals(mnemonic) {
    const message = this.getMessage(mnemonic)
    let signals = []
    if (message) {
      if (message.multiplexor) {
        signals.push(message.multiplexor)
      }
      if (message.signals) {
        signals = signals.concat(message.signals)
      }
      if (message.multiplexed) {
        signals = signals.concat(Object.values(message.multiplexed).flat())
      }
    }
    return signals
  }

  indexMessage(message) {
    this.messageById[message.id] = message
    this.messageBySlug[message.category + '/' + message.path] = message
    this.messageByMnemonic[message.mnemonic] = message
    if (message.signals) {
      message.signals.forEach(s => {
        s.message = message
        this.signalByMnemonic[s.mnemonic] = s
      })
    }
    if (message.multiplexor) {
      message.multiplexor.message = message
      this.signalByMnemonic[message.multiplexor.mnemonic] = message.multiplexor
    }
    if (message.multiplexed) {
      Object.values(message.multiplexed).flat().forEach(s => {
        s.message = message
        this.signalByMnemonic[s.mnemonic] = s
      })
    }
  }
}
