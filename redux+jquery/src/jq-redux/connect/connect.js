import { wrapMapToPropsFunc } from './wrapMaptoProps'
import connectAdvanced from '../components/connectAdvanced'
import defaultSelectorFactory from './selectorFactory'


export function createConnect(
    {
        connectHOC = connectAdvanced,
        mapStateToPropsFactories = wrapMapToPropsFunc,
        mapDispatchToPropsFactories = wrapMapToPropsFunc,
        selectorFactory = defaultSelectorFactory
    } = {}
) {
    return function connect(
        mapStateToProps,
        mapDispatchToProps
    ) {
        const initMapStateToProps = mapStateToPropsFactories(mapStateToProps)
        const initMapDispatchToProps = mapDispatchToPropsFactories(mapDispatchToProps)
        return connectHOC(selectorFactory, {
            initMapStateToProps,
            initMapDispatchToProps
        })
    }
}

export default createConnect();