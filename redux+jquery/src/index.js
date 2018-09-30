import '../../store'
import ChatInfo from './components/chat/Info/index.js'
import { HashRouter, history } from './router'

class App {
  constructor (props) {
    this.initContainer()
  }

  initContainer () {
    // let chatInfo = new ChatInfo({ domId: 'chat-info' })
    let router = new HashRouter({
      domId: 'xxx',
      history,
      routes: {
        a: {
          domId: 'xxx/:id/:name',
          path: '/a',
          component: ChatInfo,
          onEnter: () => {
            return true
          }
        },
        b: {
          domId: 'xx',
          path: '/b',
          component: ChatInfo
        }
      }
    })
  }
}

const app = new App()
