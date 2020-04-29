import categories from '../data/categories.json'
import tm3 from '../data/tesla_model_3_dbc.json'

// index the dbc to make message and signal lookup efficient
const indexes = {
  messageIds: {},
  messagePaths: {},
  messageMnemonics: {},
  signalMnemonics: {}
}

function indexMessage(message) {
  indexes.messageIds[message.id] = message
  indexes.messagePaths[message.category + '/' + message.path] = message
  indexes.messageMnemonics[message.mnemonic] = message
  if (message.signals) {
    message.signals.forEach(s => {
      s.message = message
      indexes.signalMnemonics[s.mnemonic] = s
    })
  }
  if (message.multiplexor) {
    message.multiplexor.message = message
    indexes.signalMnemonics[message.multiplexor.mnemonic] = message.multiplexor
  }
  if (message.multiplexed) {
    Object.values(message.multiplexed).flat().forEach(s => {
      s.message = message
      indexes.signalMnemonics[s.mnemonic] = s
    })
  }
}

tm3.messages.forEach(m => indexMessage(m))

class DBC {

  static addMessage(message) {
    if (!DBC.getMessageFromId(message.id)) {
      tm3.messages.push(message)
      indexMessage(message)
    }
  }

  static getMessageFromPath(categoryPath, messagePath) {
    return indexes.messagePaths[categoryPath + '/' + messagePath]
  }

  static getMessageFromId(id) {
    return indexes.messageIds[id]
  }

  static getMessage(mnemonic) {
    return indexes.messageMnemonics[mnemonic]
  }

  static getSignal(mnemonic) {
    return indexes.signalMnemonics[mnemonic]
  }

  static getCategories() {
    return categories
  }

  static getFirstCategory() {
    return categories[0]
  }

  static getCategory(categoryPath) {
    return categories.find(c => c.path === categoryPath)
  }

  static getFirstCategoryMessage(categoryPath) {
    return tm3.messages.find(m => m.category === categoryPath)
  }

  static getCategoryMessages(categoryPath) {
    return tm3.messages.filter(m => m.category === categoryPath)
  }

  static getMessageSignals(message) {
    var signals = []
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
}

export default DBC
