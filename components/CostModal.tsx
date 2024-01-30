"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Tooltip,
  Form,
  Input,
  Switch,
  Select,
  InputNumber,
  message,
} from "antd";
import {
  PlusOutlined,
  PlusCircleFilled,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { createClient } from "@/utils/supabase/client";
import { PMEX } from "@/app/actions";

export default function MDexpesescost() {
  const [open, setOpen] = useState(false);
  const [Comselec, setComselec] = useState<any>([]);
  const [SelcCom, setSelccom] = useState<any>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm(); // เพิ่ม form instance
  const supabase = createClient();

  useEffect(() => {
    const fetchSelcom = async () => {
      let { data: selection, error } = await supabase
        .from("selection")
        .select("company")
        .like("company ", "%Premier Gold%");

      if (selection) {
        setComselec(selection);

        const seleccom = selection.map(({ company }) => ({
          value: company,
          label: company,
        }));
        setSelccom(seleccom);
      }
      if (!selection || error) {
        console.log("SELCompany :", error);
      }
    };
    fetchSelcom();
  }, []);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      const DataPm = form.getFieldsValue();
      const DataPmJSON = JSON.stringify(DataPm);

      console.log(DataPmJSON);
      await PMEX(DataPmJSON);

      handleCancel();
      messageApi.success("Success Insert Premier Gold!!");
      setTimeout(() => {
        window.location.reload();
      }, 1100);
    } catch (error) {
      console.error("Error:", error);
      messageApi.error("Error Insert Premier Gold!!!");
    }
  };

  const handleCancel = () => {
    form.resetFields(); // ล้างข้อมูลฟอร์มเมื่อ Modal ถูกปิด
    setOpen(false);
  };

  return (
    <>
      <div className="flex justify-end mr-2">
        <Button className="mr-2" danger>Update Status</Button>

        <Tooltip title="Add">
          <Button
            size="middle"
            icon={<PlusOutlined />}
            onClick={showModal}
            className="buttonYTPm1"
          />
        </Tooltip>
      </div>
      <div className="mb-4"></div>
      <Modal
        open={open}
        title={
          <div className="flex items-center space-x-1">
            <PlusCircleFilled className="mr-2 text-teal-600" />
            Add Expenses Premier Gold
          </div>
        }
        onCancel={handleCancel}
        footer={[
          <div>
            {contextHolder}
            <Button
              shape="round"
              icon={<CheckOutlined />}
              onClick={handleOk}
              className="ml-2"
            >
              Save
            </Button>
            <Tooltip title="Cancle">
              <Button
                type="primary"
                danger
                icon={<CloseOutlined />}
                onClick={handleCancel}
                shape="circle"
                className="ml-2"
              ></Button>
            </Tooltip>
          </div>,
        ]}
      >
        <Form
          form={form}
          style={{ maxWidth: 450 }}
          initialValues={{ status: false }}
          autoComplete="off"
          labelCol={{ span: 4 }}
        >
          <Form.Item
            label="List"
            name="text"
            rules={[{ required: true, message: "Please input your Name!" }]}
            className="mb-4"
          >
            <Input name="text" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Company"
            name="company"
            rules={[{ required: true, message: "Please Select Your Company!" }]}
            className="mb-4"
          >
            <Select
              placeholder="Search to Select"
              optionFilterProp="children"
              options={SelcCom}
            />
          </Form.Item>

          <Form.Item
            label="Cost"
            name="cost"
            className="mb-4"
            initialValue={0}
            rules={[
              {
                required: true,
                type: "number",
                message: "Please input a valid number",
              },
            ]}
          >
            <InputNumber
              prefix="THB"
              className="w-full"
              name="cost"
              formatter={(value) => (value ? `${parseFloat(value)}` : "0")}
              parser={(value) => (value ? parseFloat(value) : 0)}
            />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              className="bg-red-500"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
