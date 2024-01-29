"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import {
  Table,
  Badge,
  Col,
  Row,
  Statistic,
  Card as Cardantd,
  Space,
  Tooltip,
  Button,
  Modal,
  Form,
  Switch,
  Input,
  Select,
  InputNumber,
  message,
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Card } from "@tremor/react";
import { createClient } from "@/utils/supabase/client";

import MDexpesescost from "./CostModal";

interface DataType {
  key: React.Key;
  id: number;
  text: string;
  company: string;
  cost: number;
  status: boolean;
}

export default function Monthlyexpenses() {
  const supabase = createClient();
  const [Monye, setMoye] = useState<any>([]);

  useEffect(() => {
    const fetchPM = async () => {
      let { data: expenses, error } = await supabase
        .from("expenses")
        .select("*")
        .like("company ", "%Premier Gold%");
      if (expenses) {
        setMoye(expenses);
      }
      if (!expenses || error) {
        console.log("PM :", error);
      }
    };
    fetchPM();
  }, []);

  const totalCost = Monye.reduce(
    (accumulator: any, currentExpense: { cost: any }) => {
      return accumulator + currentExpense.cost;
    },
    0
  );

  //true
  const PaidCost = Monye.filter(
    (expense: { status: any }) => expense.status
  ).reduce((accumulator: any, currentExpense: { cost: any }) => {
    return accumulator + currentExpense.cost;
  }, 0);

  //false
  const UnPaidCost = Monye.filter(
    (expense: { status: any }) => !expense.status
  ).reduce((accumulator: any, currentExpense: { cost: any }) => {
    return accumulator + currentExpense.cost;
  }, 0);

  const [messageApi, contextHolder] = message.useMessage();
  const [editedData, setEditedData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (editedData) {
      form.setFieldsValue({
        id: editedData.id,
        text: editedData.text,
        cost: editedData.cost,
        company: editedData.company,
        status: editedData.status,
      });
    }
  }, [editedData, form]);

  const showModal = (record: SetStateAction<null>) => {
    setEditedData(null);
    setEditedData(record);
    setIsModalOpen(true);
  };

  const handleDel = async (record: any) => {
    try {
      const { id } = record;

      console.log("id:", id);

      messageApi.success("Success Delete !!");
    } catch (error) {
      console.error("ErrorDel:", error);
      messageApi.error("Error Delete!!!");
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleCancel = () => {
    setEditedData(null);
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      if (editedData) {
        const EditData = form.getFieldsValue();
        const EditDataJSON = JSON.stringify(EditData);

        console.log(EditDataJSON);

        handleCancel(); // หลังจากส่งข้อมูลเสร็จ ปิด Modal
        messageApi.success("Success Update!!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error:", error);
      messageApi.error("Error Update!!!");
    }
  };

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Cardantd bordered={true}>
            <Statistic
              title="All Expenses"
              value={totalCost}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              suffix="THB"
            />
          </Cardantd>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Cardantd bordered={true}>
            <Statistic
              title="Paid"
              value={PaidCost}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              suffix="THB"
            />
          </Cardantd>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Cardantd bordered={true}>
            <Statistic
              title="Remain"
              value={UnPaidCost}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              suffix="THB"
            />
          </Cardantd>
        </Col>
      </Row>

      <div className="mb-4"></div>

      <Card decoration="left" decorationColor="indigo" key="unique-key">
        <MDexpesescost />
        <Table
          dataSource={Monye}
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              key: "id",
              sorter: (id1: { id: number }, id2: { id: number }) =>
                id1.id - id2.id,
              defaultSortOrder: "ascend", // เรียงลำดับจากน้อยไปมาก
            },
            {
              title: "List",
              dataIndex: "text",
              key: "text",
            },
            {
              title: "Company",
              dataIndex: "company",
              key: "company",
            },
            {
              title: "Cost",
              dataIndex: "cost",
              key: "cost",
              render: (cost: number) => (
                <span>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "THB",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(cost)}
                </span>
              ),
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (status: any) => (
                <Badge
                  status={status ? "success" : "error"}
                  text={status ? "Paid" : "UnPaid"}
                />
              ),
            },
            {
              title: "",
              key: "action",
              render: (_, record) => (
                <Space size="middle">
                  {contextHolder}
                  <Tooltip title="Edit">
                    <Button
                      shape="circle"
                      icon={<EditFilled />}
                      size={"small"}
                      onClick={() => showModal(record)}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button
                      danger
                      shape="circle"
                      icon={<DeleteFilled />}
                      size={"small"}
                      onClick={() => handleDel(record)}
                    />
                  </Tooltip>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={
          <div className="flex items-center space-x-1">
            <EditFilled className="mr-2 text-teal-600" />
            Edit Youtube Premium
          </div>
        }
        open={isModalOpen}
        //onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button shape="round" icon={<CheckOutlined />} onClick={handleOk}>
            Save
          </Button>,
          <Tooltip title="Cancle">
            <Button
              type="primary"
              danger
              icon={<CloseOutlined />}
              onClick={handleCancel}
              shape="circle"
            ></Button>
          </Tooltip>,
        ]}
      >
        <Form
          style={{ maxWidth: 450 }}
          autoComplete="off"
          form={form}
          labelCol={{ span: 4 }}
          //wrapperCol={{ span: 9 }}
        >
          {editedData && (
            <>
              <Form.Item label="ID" name="id" className="mb-4" hidden>
                <p>{editedData?.id}</p>
              </Form.Item>

              <div className="mb-4"></div>
              <Form.Item label="List" name="text">
                <Input name="text" className="w-full" />
              </Form.Item>

              <Form.Item label="Company" name="company" className="mb-4">
                <Select
                  placeholder="Search to Select"
                  optionFilterProp="children"
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
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
