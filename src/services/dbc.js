// DBC Access

export default class DBC {

  constructor(categories, definitions) {
    this.categories = categories
    this.definitions = definitions

    // indexes
    this.messageById = {}
    this.messageByPath = {}
    this.messageByMnemonic = {}
    this.signalByMnemonic = {}
    this.definitions.messages.forEach(m => this.indexMessage(m))
  }

  addMessage(message) {
    if (!this.getMessageFromId(message.id)) {
      this.definitions.messages.push(message)
      this.indexMessage(message)
    }
  }

  getMessageFromPath(categoryPath, messagePath) {
    return this.messageByPath[categoryPath + '/' + messagePath]
  }

  getMessageFromId(id) {
    return this.messageById[id]
  }

  getMessage(mnemonic) {
    return this.messageByMnemonic[mnemonic]
  }

  getSignal(mnemonic) {
    return this.signalByMnemonic[mnemonic]
  }

  getCategories() {
    return this.categories
  }

  getFirstCategory() {
    return this.categories[0]
  }

  getCategory(categoryPath) {
    return this.categories.find(c => c.path === categoryPath)
  }

  getFirstCategoryMessage(categoryPath) {
    return this.definitions.messages.find(m => m.category === categoryPath)
  }

  getCategoryMessages(categoryPath) {
    return this.definitions.messages.filter(m => m.category === categoryPath)
  }

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
    this.messageByPath[message.category + '/' + message.path] = message
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
