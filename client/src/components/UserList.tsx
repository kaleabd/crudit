import React, { useState } from "react";
import { Table, Button, Space, notification } from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import UserForm from "./UserForm";

// Define the User type
interface User {
  id?: number | undefined;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

// Function to fetch users from the API
const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("http://localhost:3000/users/");
  const data = await response.json();
  return data;
};

// Function to delete a user by ID
const deleteUser = async (id: number): Promise<void> => {
  await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
};

const UserList: React.FC = () => {
  const queryClient = useQueryClient();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();

  // Fetch users using react-query
  const { data: users, isLoading } = useQuery("users", fetchUsers);

  // Mutation to delete a user
  const mutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      notification.error({
        message: "User Deleted",
        description: "User has been deleted successfully.",
      });
    },
  });

  // Function to update a user
  const updateUser = async (user: User): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        queryClient.invalidateQueries("users");
        // notification.success({
        //   message: "User Updated",
        //   description: "User has been updated successfully.",
        // });
      } else {
        console.error("Failed to update user:", response.statusText);
        notification.error({
          message: "Error",
          description: "Failed to update user.",
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while updating user.",
      });
    }
  };

  const handleDelete = (id: number) => {
    mutation.mutate(id);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormVisible(true);
  };

  const handleFormSubmit = (values: User) => {
    // Close the form modal
    setIsFormVisible(false);

    const hasChanges =
      selectedUser?.username !== values.username ||
      selectedUser?.email !== values.email ||
      selectedUser?.password !== values.password ||
      selectedUser?.phoneNumber !== values.phoneNumber;

    if (hasChanges) {
      const updatedUser = { ...selectedUser, ...values };
      updateUser(updatedUser);
      notification.success({
        message: "User Updated",
        description: "User has been updated successfully.",
      });
    } else {
      notification.error({
        message: "No Changes",
        description: "There's no change!.",
      });
    }
  };

  // Define columns for the table
  const columns = [
    { title: "Name", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Password", dataIndex: "password", key: "password" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: User | any) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="dashed" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <UserForm
        visible={isFormVisible}
        onCancel={() => setIsFormVisible(false)}
        onSubmit={handleFormSubmit}
        initialValues={selectedUser}
      />
      <Table
        dataSource={users}
        columns={columns}
        loading={isLoading}
        rowKey="id"
      />
    </div>
  );
};

export default UserList;
