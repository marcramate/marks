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
  Tag,
  DatePicker,
  DatePickerProps,
  FloatButton,
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  DownloadOutlined,
  BarsOutlined,
  PlusOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Card } from "@tremor/react";
import { createClient } from "@/utils/supabase/client";
import * as XLSX from "xlsx";

interface CreditCardProps {
  creditcard: string;
  isTab1: boolean;
}

export default function CreditCard({ creditcard, isTab1 }: CreditCardProps) {
  const supabase = createClient();
  const [Credisel, setCredisel] = useState<any>([]);
  const [spinning, setSpinning] = useState<boolean>(false);

  const creditcardselect = async () => {
    let { data: CreditCard, error } = await supabase
      .from("CreditCard")
      .select("*")
      .like("card", `%${creditcard}%`);

    if (CreditCard) {
      console.log("DATA Credit Sel", creditcard);
      setCredisel(CreditCard);
    }

    if (!CreditCard || error) {
      console.log("ERRORCreditCard :", error);
    }
  };
  useEffect(() => {
    creditcardselect();
  }, [creditcard, isTab1]);

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Cardantd bordered={true}>
            <Statistic
              title="All Expenses"
              value="{totalCost}"
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix="THB"
            />
          </Cardantd>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Cardantd bordered={true}>
            <Statistic
              title="Paid"
              value="sd"
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix="THB"
            />
          </Cardantd>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Cardantd bordered={true}>
            <Statistic
              title="Remain"
              value="{UnPaidCost}"
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix="THB"
            />
          </Cardantd>
        </Col>
      </Row>
      <div className="mb-4"></div>
      <AddCreditCost />
      <Spin
        spinning={spinning}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <Card decoration="left" decorationColor="indigo" key="unique-key">
          <Table
            dataSource={Credisel}
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
                title: "Date",
                dataIndex: "date",
                key: "date",
                render: (date) => {
                  const fomatsd = dayjs(date).format("DD/MM/YYYY");
                  return <span>{fomatsd}</span>;
                },
              },
              {
                title: "List",
                dataIndex: "list",
                key: "list",
              },
              {
                title: "Card",
                dataIndex: "card",
                key: "card",
              },
              {
                title: "Price",
                dataIndex: "price",
                key: "price",
                render: (price: number) => (
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(price)}
                  </span>
                ),
              },
              {
                title: "Purchase_type",
                dataIndex: "purchase_type",
                key: "purchase_type",
              },
              {
                title: "Oncredit_month",
                dataIndex: "oncredit_month",
                key: "oncredit_month",
                render: (oncredit_month: number | null) => (
                  <Statistic
                    value={oncredit_month !== null ? oncredit_month : "-"}
                    precision={0}
                    valueStyle={{ color: "#000", fontSize: "14px" }}
                    suffix={oncredit_month !== null ? "month" : ""}
                  />
                ),
              },
              {
                title: "Price_oncredit",
                dataIndex: "price_oncredit",
                key: "price_oncredit",
                render: (price_oncredit: number) => (
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(price_oncredit)}
                  </span>
                ),
              },
              {
                title: "Type",
                dataIndex: "type",
                key: "type",
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
                    <Tooltip title="UpdateStatus">
                      <Button
                        className="buttonUpStatus"
                        shape="round"
                        icon={<CheckOutlined className="text-green-700" />}
                        size={"small"}
                        //onClick={() => handleStatus(record)}
                      >
                        UpdateStatus
                      </Button>
                    </Tooltip>
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
      </Spin>
    </div>
  );
}

export function AddCreditCost() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm(); // เพิ่ม form instance
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    setOpen(true);
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
          tooltip={<div>Add Cost Credit</div>}
          onClick={showModal}
        />
      </FloatButton.Group>

      <Modal
        open={open}
        title={
          <div className="flex items-center space-x-1">
            <PlusCircleFilled className="mr-2 text-teal-600" />
            Add Credit Cost 
          </div>
        }
        //onOk={handleOk}
        // onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {contextHolder}
            <Button
              shape="round"
              icon={<CheckOutlined />}
              //onClick={handleOk}
              className="ml-2"
            >
              Save
            </Button>
            <Tooltip title="Cancle">
              <Button
                type="primary"
                danger
                icon={<CloseOutlined />}
                //onClick={handleCancel}
                shape="circle"
                className="ml-2"
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
            label="List"
            name="list"
            rules={[{ required: true, message: "Please input your List!" }]}
            className="mb-4"
          >
            <Input name="list" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please input Month!" }]}
            className="mb-4"
          >
            <DatePicker
              //onChange={onChange}
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
              //onChange={onChange}
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
