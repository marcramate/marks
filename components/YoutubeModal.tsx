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
import { YTPM } from "../app/actions";
import axios from "axios";

export default function MDYoutubePremium() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm(); // เพิ่ม form instance

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
    } catch (error) {
      console.error("Error:", error);
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
      <form action={YTPM}>
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
          //onOk={handleOk}
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
            form={form}
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
              <Input name="name" />
            </Form.Item>

            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: "Please input Month!" }]}
            >
              <DatePicker
                onChange={onChange}
                style={{ width: 250 }}
                name="date"
              />
            </Form.Item>

            <Form.Item label="Pay_Status" name="pay_status">
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                className="bg-red-500"
                defaultChecked={false}
              />
            </Form.Item>
          </Form>
        </Modal>
      </form>
    </div>
  );
}
