import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Tooltip, IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";

import Table from "../components/Table";
import Dialog from "../components/Dialog";

import {
  loadUsers,
  deleteUser,
  deleteMultipleUsers,
  resetUserList,
} from "../store/userList";

const headCells = [
  { id: "id", type: "number", label: "ID" },
  { id: "first_name", type: "string", label: "First Name" },
  { id: "last_name", type: "string", label: "Last Name" },
  { id: "email", type: "string", label: "Email" },
  { id: "is_active", type: "bool", label: "Active" },
  { id: "is_staff", type: "bool", label: "Admin" },
  { id: "" },
];

const bodyCells = [
  { key: "id" },
  { key: "first_name" },
  { key: "last_name" },
  { key: "email" },
  { key: "is_active", type: "bool" },
  { key: "is_staff", type: "bool" },
];

const getActionButtons = (users, viewHandler, deleteHandler) => {
  let actionButtons = [];

  users.forEach((user) => {
    actionButtons.push({
      id: user.id,
      buttons: (
        <Stack direction="row">
          <Tooltip enterDelay={500} title="Details">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                viewHandler(user.id);
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip enterDelay={500} title="Delete">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                deleteHandler(user.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    });
  });

  return actionButtons;
};

const UserListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxState = useSelector((state) => state);
  const { users, loading, error, successDelete } = reduxState.userList;
  const { userInfo } = reduxState.user;

  const [selected, setSelected] = useState([]);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState(false);
  const [user, setUser] = useState({});

  const selectedUsers = users.filter((user) => selected.includes(user.id));

  useEffect(() => {
    if (userInfo && userInfo.is_staff) {
      dispatch(loadUsers());

      if (successDelete) {
        dispatch(resetUserList());
      }
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, successDelete, userInfo]);

  const handleDeleteUser = () => {
    dispatch(deleteUser(user.id));
    toast.success("User deleted successfully");
    setDeleteUserOpen(false);
    setUser({});
  };

  const handleOpenDeleteUser = (userId) => {
    const user_to_delete = users.find((user) => user.id === userId);
    setUser(user_to_delete);
    setDeleteUserOpen(true);
  };

  const handleDeleteSelectedUsers = () => {
    dispatch(deleteMultipleUsers(selected));
    setDeleteMultipleOpen(false);
    toast.success("Users deleted successfully");
    setSelected([]);
  };

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const DeleteUsersButton = () => (
    <Tooltip title="Delete users">
      <IconButton
        onClick={() => setDeleteMultipleOpen(true)}
        disabled={loading}
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );

  return (
    <>
      <Table
        tableTitle="Users"
        data={users}
        pk="id"
        headCells={headCells}
        bodyCells={bodyCells}
        loading={loading}
        selected={selected}
        setSelected={setSelected}
        toolBarSelectedActions={[DeleteUsersButton]}
        rowActionButtons={getActionButtons(
          users,
          handleViewUser,
          handleOpenDeleteUser
        )}
      />

      <Dialog
        open={deleteMultipleOpen}
        onCloseHandler={() => setDeleteMultipleOpen(false)}
        title="Delete Users"
        description={
          <div>
            Are you sure you want to want to delete the following{" "}
            {selectedUsers.length === 1 ? "user" : "users"}?
            <ul>
              {selectedUsers.map((user) => (
                <li key={user.id}>{`${user.first_name} ${user.last_name}`}</li>
              ))}
            </ul>
          </div>
        }
        confirmButton={
          <Button
            autoFocus
            color="error"
            variant="outlined"
            onClick={handleDeleteSelectedUsers}
          >
            Delete
          </Button>
        }
      />

      <Dialog
        open={deleteUserOpen}
        onCloseHandler={() => setDeleteUserOpen(false)}
        title="Delete User"
        description={
          <div>
            Are you sure you want to want to delete user:{" "}
            {` (${user.id}) - ${user.first_name} ${user.last_name}`} ?
          </div>
        }
        confirmButton={
          <Button
            autoFocus
            color="error"
            variant="outlined"
            onClick={handleDeleteUser}
          >
            Delete
          </Button>
        }
      />
    </>
  );
};

export default UserListPage;
