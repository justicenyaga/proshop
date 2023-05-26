import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { loadUsers, deleteUser } from "../store/userList";

const UserListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxState = useSelector((state) => state);
  const { users, loading, error, successDelete } = reduxState.userList;
  const { userInfo } = reduxState.user;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(loadUsers());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, successDelete, userInfo]);

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?"))
      dispatch(deleteUser(userId));
  };

  return (
    <div>
      <h1>Users</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped hover bordered responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <i className="fa fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fa fa-times" style={{ color: "red" }}></i>
                  )}
                </td>

                <td>
                  <LinkContainer to={`/admin/users/${user._id}`}>
                    <Button variant="light" className="btn btn-sm">
                      <i className="fa fa-edit"></i>
                    </Button>
                  </LinkContainer>

                  <Button
                    variant="danger"
                    className="btn btn-sm"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <i className="fa fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserListPage;
