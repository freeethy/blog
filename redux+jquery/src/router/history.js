// Now is just for hashRouter

class History {
  constructor () {
    this.listeners = []
  }

  push = path => {
    window.location.hash = path
    this.notifyAll()
  }

  listen = listener => {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(ele => ele !== listener)
    }
  }

  notifyAll = () => {
    this.listeners.forEach(listen => {
      listen()
    })
  }
}

export default new History()
