"use client";
import React, { useEffect, useState } from "react";
import { Table, Badge, Col, Row, Statistic, Card as Cardantd } from "antd";
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
          ]}
        />
      </Card>
    </div>
  );
}
