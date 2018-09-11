import Component from "../../../jq-component";
import { connect } from "../../../jq-redux";
import { bindActionCreators } from "redux";
import commonActions from "../../../actions/common";

class Info extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { maxCapacity = 0 } = this.props;

    return `
      <div class="head">${maxCapacity}</div>
    `;
  }
  componentDidMount() {
    const { commonActions } = this.props;
    const { imRequest } = commonActions;
    let container = `#${this._domId}`;

    imRequest({
      kind: MSG_TYPE_SEAT_LOGOUT,
      message: 0
    });
  }
}
const mapStateToProps = state => ({
  maxCapacity: state.maxCapacity
});
const mapDispatchToProps = dispatch => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};
Info = connect(
  mapStateToProps,
  mapDispatchToProps
)(Info);

export default Info;
