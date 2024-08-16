import { Button, Form, FormProps, Input, notification } from "antd";
import axios from "axios";
import { useState } from "react";

const URL = import.meta.env.VITE_BACKEND_API_URL;

import {
  CREATE_USER_SUCCESS,
  SEND_USER_DATA_ERROR,
  SUBMIT_BTN_TEXT,
  USERNAME_FIELD_EMPTY_ERROR,
  USERNAME_FIELD_LABEL,
  USERNAME_FIELD_VALIDATION_ERROR,
} from "../../constants/text";
import { styles } from "./Form.style";
import { FieldType } from "./types";

export const UserCreateForm = () => {
  const [form] = Form.useForm();
  const [formError, setFormError] = useState<string | null>(null);
  const [api, contextHolder] = notification.useNotification();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setFormError(null);
    try {
      await axios.post(`${URL}/user-create`, {
        user_name: values.username,
      });
      api.open({
        message: CREATE_USER_SUCCESS,
      });
      form.resetFields();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setFormError(error.response.data.message || SEND_USER_DATA_ERROR);
      } else {
        setFormError(SEND_USER_DATA_ERROR);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateTelegramUsername = (rule: any, value: string) => {
    if (!value) {
      return Promise.reject(USERNAME_FIELD_EMPTY_ERROR);
    }

    const telegramUsernameRegex = /^@\w+$/;
    if (!telegramUsernameRegex.test(value)) {
      return Promise.reject(USERNAME_FIELD_VALIDATION_ERROR);
    }

    return Promise.resolve();
  };

  return (
    <div style={styles.container}>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        style={{ width: 300, maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label={USERNAME_FIELD_LABEL}
          name="username"
          rules={[{ validator: validateTelegramUsername }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {SUBMIT_BTN_TEXT}
          </Button>
        </Form.Item>
        {contextHolder}
        {formError && (
          <Form.Item>
            <div style={styles.error}>{formError}</div>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};
