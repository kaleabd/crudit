import React, { useState } from "react";
import { Form, Input, Button, Modal, notification } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "react-query";

export interface UserFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: UserValues) => void;
  initialValues?: UserValues | null;
}

export interface UserValues {
  id?: number;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
});

const UserForm: React.FC<UserFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const queryClient = useQueryClient();

  const firstValues = initialValues
    ? initialValues
    : {
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
      };

  React.useEffect(() => {
    if (initialValues) {
      formik.setValues(initialValues);
    }
  }, [initialValues]);
  const formik = useFormik({
    initialValues: firstValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Send a POST request to the server
        const response = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          queryClient.invalidateQueries("users");
          onSubmit(values);
          onCancel();
        } else {
          // Handle unsuccessful response
          const errorResponse = await response.json();
          notification.error({
            message: "Failed to submit data",
            description: errorResponse.error,
          });
          console.error("Failed to submit data:", response.statusText);
        }
      } catch (error: any) {
        // Handle fetch errors
        notification.error({
          message: "Error submitting data",
          description: error,
        });
        console.error("Error submitting data:", error);
      }
    },
  });

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={() => formik.handleSubmit()}
      title="Users Form"
    >
      <Form layout="vertical">
        <Form.Item label="username" required>
          <Input {...formik.getFieldProps("username")} />
          {formik.errors.username && (
            <div style={{ color: "red" }}>{formik.errors.username}</div>
          )}
        </Form.Item>
        <Form.Item label="Email" required>
          <Input {...formik.getFieldProps("email")} />
          {formik.errors.email && (
            <div style={{ color: "red" }}>{formik.errors.email}</div>
          )}
        </Form.Item>
        <Form.Item label="Password" required>
          <Input type="password" {...formik.getFieldProps("password")} />
          {formik.errors.password && (
            <div style={{ color: "red" }}>{formik.errors.password}</div>
          )}
        </Form.Item>
        <Form.Item label="Phone Number" required>
          <Input {...formik.getFieldProps("phoneNumber")} />
          {formik.errors.phoneNumber && (
            <div style={{ color: "red" }}>{formik.errors.phoneNumber}</div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;
