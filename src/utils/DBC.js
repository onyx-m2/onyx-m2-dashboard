// This is shared with server code, make a package?

/**
 * Data access class to navigate DBC files, with fast lookup by slug, id, and mnemonic.
 */
export default class DBC {

  /**
   * Construct a DBC object using the specified pre-loaded data.
   * @param {Object} definitions The parsed json data containing the message and signal definitions
   */
  constructor(definitions) {
    this.categories = definitions.categories
    this.messages = definitions.messages

    // indexes
    this.messageById = {}
    this.messageBySlug = {}
    this.messageByMnemonic = {}
    this.signalByMnemonic = {}
    this.messageBySignalMnemonic = {}
    this.messages.forEach(m => this.indexMessage(m))
  }

  /**
   * Remove indexes from generated JSON representation.
   */
  toJSON() {
    const { categories, messages } = this
    return { categories, messages }
  }

  /**
   * Add a message to the DBC definitions, and have it get indexed.
   * @param {Object} message A message definition
   */
  addMessage(message) {
    if (!this.getMessageFromId(message.bus, message.id)) {
      this.messages.push(message)
      this.indexMessage(message)
    }
  }

  /**
   * Get the message that matches the specified category and message slugs.
   * @param {String} categorySlug
   * @param {String} messageSlug
   */
  getMessageFromSlugs(categorySlug, messageSlug) {
    return this.messageBySlug[categorySlug + '/' + messageSlug]
  }

  /**
   * Get the message that matches the specified id.
   * @param {Number} id
   */
  getMessageFromId(bus, id) {
    const message = this.messageById[id]
    if (message && message.bus === bus) {
      return message
    }
    return null
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
   * Get the signal value that matches the specified mnemonic and name.
   * @param {String} mnemonic: Signal mnemonic
   * @param {String} name: Value name
   */
  getSignalNamedValue(mnemonic, name) {
    const signal = this.signalByMnemonic[mnemonic]
    if (signal && signal.namedValues) {
      return signal.namedValues[name]
    }
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
    return this.categories.find(c => c.slug === slug)
  }

  /**
   * Get the first message of the category that matches the specified slug.
   * @param {String} slug
   */
  getFirstCategoryMessage(slug) {
    return this.messages.find(m => m.category === slug)
  }

  /**
   * Get the messages that match the category of the specified slug.
   * @param {String} slug
   */
  getCategoryMessages(slug) {
    return this.messages.filter(m => m.category === slug)
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

  decodeSignal(bitView, signal) {
    try {
      const val = bitView.getBits(signal.start, signal.length, signal.signed)
      return signal.offset + signal.scale * val
    } catch {
      return NaN
    }
  }

  getSignalMessage(mnemonic) {
    return this.messageBySignalMnemonic[mnemonic]
  }

  indexMessage(message) {
    this.messageById[message.id] = message
    this.messageBySlug[message.category + '/' + message.slug] = message
    this.messageByMnemonic[message.mnemonic] = message
    if (message.signals) {
      message.signals.forEach(s => {
        this.messageBySignalMnemonic[s.mnemonic] = message
        this.signalByMnemonic[s.mnemonic] = s
        if (s.values) {
          s.namedValues = {}
          Object.keys(s.values).forEach(k => {
            s.namedValues[s.values[k]] = Number(k)
          })
        }
      })
    }
    if (message.multiplexor) {
      const { mnemonic } = message.multiplexor
      this.messageBySignalMnemonic[mnemonic] = message
      this.signalByMnemonic[mnemonic] = message.multiplexor
    }
    if (message.multiplexed) {
      Object.values(message.multiplexed).flat().forEach(s => {
        this.messageBySignalMnemonic[s.mnemonic] = message
        this.signalByMnemonic[s.mnemonic] = s
      })
    }
  }

}
