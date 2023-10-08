import React, { useState } from "react";
import UserForm, { UserValues } from "./components/UserForm";
import UserList from "./components/UserList";
import { Button } from "antd";

function App() {
  const [isUserFormVisible, setIsUserFormVisible] = useState(false);

  const handleUserFormToggle = () => {
    setIsUserFormVisible(!isUserFormVisible);
  };
  const handleUserFormSubmit = (values: UserValues) => {
    setIsUserFormVisible((prev) => !prev);
  };

  return (
    <div>
      <Button type="primary" onClick={handleUserFormToggle}>
        Create Users
      </Button>

      <UserForm
        visible={isUserFormVisible}
        onCancel={handleUserFormToggle}
        onSubmit={handleUserFormSubmit}
        initialValues={{
          username: "",
          email: "",
          password: "",
          phoneNumber: "",
        }}
      />
      <UserList />
    </div>
  );
}

export default App;
