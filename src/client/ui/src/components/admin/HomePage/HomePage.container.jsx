import { connect } from 'react-redux'
import { getOrderList } from '../../../redux/order/order.actions'
import { getUserList } from '../../../redux/user/user.actions'
import { getTokenList } from '../../../redux/token/token.actions'
import { getProjectList } from '../../../redux/project/project.actions'
import HomePage from './HomePage.component'

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  getOrderListObj: state.order.getOrderList,
  getUserListObj: state.user.getList,
  getTokenListObj: state.token.getTokenList,
  getProjectListObj: state.project.getProjectList,
})

const mapDispatchToProps = dispatch => ({
  getOrderList: ({ pagination, sortField, sortOrder, filters }) =>
    dispatch(getOrderList({ pagination, sortField, sortOrder, filters })),
  getUserList: ({ pagination, sortField, sortOrder, filters }) =>
    dispatch(getUserList({ pagination, sortField, sortOrder, filters })),
  getTokenList: ({ pagination, sortField, sortOrder, filters }) =>
    dispatch(getTokenList({ pagination, sortField, sortOrder, filters })),
  getProjectList: ({ pagination, sortField, sortOrder, filters }) =>
    dispatch(getProjectList({ pagination, sortField, sortOrder, filters })),
})

const HomePageContainer = connect(mapStateToProps, mapDispatchToProps)(HomePage)

export default HomePageContainer
