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
  Spin,
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Card } from "@tremor/react";
import { createClient } from "@/utils/supabase/client";

import MDexpesescost from "./CostModal";
import { UPDEXPM, DELEXPM, STATUPIDPM } from "@/app/actions";
import { Gmmodal } from "./CostModal";

interface DataType {
  key: React.Key;
  id: number;
  text: string;
  company: string;
  cost: number;
  status: boolean;
}

interface MonthlyexpensesProps {
  company: string;
  isTab1: boolean;
}
export default function Monthlyexpenses({
  company,
  isTab1,
}: MonthlyexpensesProps) {
  const supabase = createClient();
  const [Monye, setMoye] = useState<any>([]);
  const [spinning, setSpinning] = useState<boolean>(false);

  const fetchPM = async () => {
    let { data: expenses, error } = await supabase
      .from("expenses")
      .select("*")
      .like("company ", `%${company}%`);

    if (expenses) {
      setMoye(expenses);
    }

    if (!expenses || error) {
      console.log("PM :", error);
    }
  };

  useEffect(() => {
    fetchPM();
  }, [company, isTab1]);

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
  const [editedDataPm, setEditedDataPm] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (editedDataPm) {
      form.setFieldsValue({
        id: editedDataPm.id,
        text: editedDataPm.text,
        cost: editedDataPm.cost,
        company: editedDataPm.company,
        status: editedDataPm.status,
      });
    }
  }, [editedDataPm, form]);

  const showModal = (record: SetStateAction<null> | { id: number }) => {
    setEditedDataPm(null);
    setEditedDataPm(record);
    setIsModalOpen(true);
  };

  const handleDel = async (record: any) => {
    try {
      const { id } = record;

      console.log("id:", id);
      setSpinning(true);
      await DELEXPM(id);

      setTimeout(() => {
        fetchPM();
        setSpinning(false);
      }, 1000);

      messageApi.success("Success Delete !!");
    } catch (error) {
      console.error("ErrorDel:", error);
      setSpinning(false);
      messageApi.error("Error Delete!!!");
    }
  };

  const handleStatus = async (record: any) => {
    try {
      const { id, status } = record;

      console.log("ID:", id, "Status:", status);

      setSpinning(true);
      await STATUPIDPM(id, status);

      setTimeout(() => {
        fetchPM();
        setSpinning(false);
      }, 1000);

      messageApi.success("Success Update Status");
    } catch (error) {
      console.log("ErrorStatus:", error);
      setSpinning(false);
      messageApi.error("Error UpdateStatus!!!");
    }
  };

  const handleCancel = () => {
    setEditedDataPm(null);
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      if (editedDataPm) {
        const EditPm = form.getFieldsValue();
        const EditJSONPm = JSON.stringify(EditPm);

        console.log(EditJSONPm);
        setSpinning(true);
        await UPDEXPM(EditJSONPm);

        handleCancel(); // หลังจากส่งข้อมูลเสร็จ ปิด Modal

        setTimeout(() => {
          fetchPM();
          setSpinning(false);
        }, 1000);
        messageApi.success("Success Update EXPM!!");
      }
    } catch (error) {
      console.error("Error:", error);
      setSpinning(false);
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
      <Spin
        spinning={spinning}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <Card decoration="left" decorationColor="indigo" key="unique-key">
          <MDexpesescost company={company} isTab1={isTab1} />
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
                    <Tooltip title="UpdateStatus">
                      <Button
                        className="buttonUpStatus"
                        shape="round"
                        icon={<CheckOutlined className="text-green-700" />}
                        size={"small"}
                        onClick={() => handleStatus(record)}
                      >
                        UpdateStatus
                      </Button>
                    </Tooltip>
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
              Edit Expenses
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
            {editedDataPm && (
              <>
                <Form.Item label="ID" name="id" className="mb-4" hidden>
                  <p>{editedDataPm?.id}</p>
                </Form.Item>

                <div className="mb-4"></div>
                <Form.Item label="List" name="text">
                  <Input name="text" className="w-full" />
                </Form.Item>

                <Form.Item label="Company" name="company" className="mb-4">
                  <Select
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    disabled
                  />
                </Form.Item>

                <Form.Item
                  label="Cost"
                  name="cost"
                  className="mb-4"
                  initialValue={0}
                  rules={[
                    {
                      type: "number",
                      message: "Please input a valid number",
                    },
                  ]}
                >
                  <InputNumber
                    prefix="THB"
                    className="w-full"
                    name="cost"
                    formatter={(value) => (value ? `${value}` : "0")}
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
      </Spin>
    </div>
  );
}

export function Gmcost() {
  const supabase = createClient();
  const [Gmexp, setGmxp] = useState<any>([]);
  const Gme = async () => {
    try {
      let { data: expenses, error } = await supabase
        .from("expenses")
        .select("*")
        .like("company", "%GraceMarc%");

      if (expenses) {
        setGmxp(expenses);
      }
      if (!expenses || error) {
        console.log("GM:", error);
      }
    } catch (error) {
      console.error("Error GM:", error);
    }
  };

  useEffect(() => {
    Gme();
  }, []);
  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Cardantd bordered={true}>
            <Statistic
              title="All Expenses"
              value="67"
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
              value="45"
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
              value="21"
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              suffix="THB"
            />
          </Cardantd>
        </Col>
      </Row>

      <div className="mb-4"></div>
      <Card decoration="top" decorationColor="indigo" key="unique-key">
        <Gmmodal />
        <Table
          dataSource={Gmexp}
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
              title: "Choice",
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
              title: "",
              key: "action",
              render: (_, record) => (
                <Space size="middle">
                  <Tooltip title="Edit">
                    <Button
                      shape="circle"
                      icon={<EditFilled />}
                      size={"small"}
                      //onClick={() => showModal(record)}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button
                      danger
                      shape="circle"
                      icon={<DeleteFilled />}
                      size={"small"}
                      //onClick={() => handleDel(record)}
                    />
                  </Tooltip>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
