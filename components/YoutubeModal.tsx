"use client";

import {
  PlusOutlined,
  BarsOutlined,
  PlusCircleFilled,
  CloseOutlined,
  CheckOutlined,
  YoutubeFilled,
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
  message,
} from "antd";
import React, { useState, useEffect } from "react";
import type { DatePickerProps } from "antd";
import { YTPM } from "../app/actions";

export default function MDYoutubePremium() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm(); // เพิ่ม form instance
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = async () => {
    try {
      const formData = form.getFieldsValue(); // ดึงข้อมูลจาก form
      const formDataJSON = JSON.stringify(formData); // แปลงเป็น JSON string

      console.log(formDataJSON);
      await YTPM(formDataJSON);

      handleCancel(); // หลังจากส่งข้อมูลเสร็จ ปิด Modal
      messageApi.success("Success Insert!!");

      setTimeout(() => {
        window.location.reload();
      }, 1800);
    } catch (error) {
      console.error("Error:", error);
      messageApi.error("Error Insert!!!");
    }
  };

  const handleCancel = () => {
    form.resetFields(); // ล้างข้อมูลฟอร์มเมื่อ Modal ถูกปิด
    setOpen(false);
  };

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <div>
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
          <div className="flex items-center space-x-1">
            <PlusCircleFilled className="mr-2 text-teal-600" />
            Add Youtube Premium
            <YoutubeFilled className="mr-2 text-red-500" />
          </div>
        }
        //onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {contextHolder}
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
          form={form}
          style={{ maxWidth: 450 }}
          initialValues={{ pay_status: false }} // กำหนดค่าเริ่มต้นของ pay_status เป็น false
          autoComplete="off"
          labelCol={{ span: 4 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your Name!" }]}
            className="mb-4"
          >
            <Input name="name" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please input Month!" }]}
            className="mb-4"
          >
            <DatePicker
              onChange={onChange}
              style={{ width: "100%" }}
              name="date"
            />
          </Form.Item>

          <Form.Item
            label="DateEnd"
            name="dateend"
            rules={[{ required: true, message: "Please input Month!" }]}
            className="mb-4"
          >
            <DatePicker
              onChange={onChange}
              style={{ width: "100%" }}
              name="dateend"
            />
          </Form.Item>

          <Form.Item label="Pay_Status" name="pay_status">
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              className="bg-red-500"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
