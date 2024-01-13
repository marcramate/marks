"use client";

import {
  PlusOutlined,
  BarsOutlined,
  PlusCircleFilled,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  FloatButton,
  Button,
  Modal,
  Tooltip,
  Form,
  Input,
  DatePicker,
  Switch,
} from "antd";
import React, { useState } from "react";
import type { DatePickerProps } from "antd";

export default function MDYoutubePremium() {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };
  return (
    <>
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 40 }}
        icon={<BarsOutlined />}
      >
        <FloatButton
          icon={<PlusOutlined />}
          tooltip={<div>Add Youtube Premium</div>}
          onClick={showModal}
        />
      </FloatButton.Group>
      <Modal
        open={open}
        title={
          <div className="flex items-center">
            <PlusCircleFilled className="mr-2 text-teal-600" />
            Add Youtube Premium
          </div>
        }
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <Button shape="round" icon={<CheckOutlined />} onClick={handleOk}>
              Save
            </Button>
            <Tooltip title="Cancle">
              <Button
                type="primary"
                danger
                icon={<CloseOutlined />}
                onClick={handleCancel}
                shape="circle"
              ></Button>
            </Tooltip>
          </>
        )}
      >
        <Form
          name="basic"
          style={{ maxWidth: 300 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please input Month!" }]}
          >
            <DatePicker
              onChange={onChange}
              style={{ width: 250 }}
              picker="month"
            />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
