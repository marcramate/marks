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
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  DownloadOutlined,
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
