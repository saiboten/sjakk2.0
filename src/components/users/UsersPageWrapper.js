import { connect } from 'react-redux';

import UsersPage from './UsersPage';

export const UserPageWrapper = connect(
    ({ users }) => ({
        users
    }),
    dispatch => ({})
)(UsersPage);