import Component from 'JqComponent'
import { compilePath, matchPath } from './utils'

/*
* props: {
*   history,
*   routes,
*   onEnter,
*   exact,
*   strict,
*   sensitive
* }
*/
class HashRouter extends Component {
  constructor (props) {
    super(props)

    this.children = {}

    this.history = props.history || {
      push (hash) {
        window.location.hash = hash
      }
    }

    this.routes = props.routes || {}
  }

  getChildComponents () {
    return this.children
  }

  componentDidMount () {
    this.unlistener = this.history.listen(this.renderRoute)
    this.history.push(window.location.hash || '/')
  }

  componentWillUnmount () {
    this.unlistener()
  }

  render () {
    return ''
  }

  onEnter = () => {
    return true
  }

  renderRoute () {
    const { exact, strict, sensitive, onEnter = this.onEnter } = this.props
    const routes = this.routes || {}
    let pathname = window.location.hash.slice(1) || '/'

    if (!onEnter() && pathname !== '/') {
      this.history.push('/')
    }

    Object.keys(routes).map(v => {
      let {
        path,
        component: Component,
        domId,
        onEnter = this.onEnter
      } = routes[v]
      let pathReAndKeys = compilePath(path, {
        exact,
        strict,
        sensitive
      })

      let match = matchPath(pathname, { path, exact }, pathReAndKeys)

      if (!match || !onEnter()) return

      let { path, params } = match
      this.children[v] = new Component({
        domId,
        props: {
          history: this.history,
          location: { pathname: path },
          params
        }
      })
    })
  }
}

export default HashRouter
