"use client";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { Card } from "@tremor/react";
import { createClient } from "@/utils/supabase/client";

interface DataType {
  key: React.Key;
  id: number;
  text: string;
  company: string;
  cost: number;
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
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
    },
  ];

  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
    },
    {
      key: "4",
      name: "Jim Red",
      age: 32,
      address: "London No. 2 Lake Park",
    },
  ];

  return (
    <div>
      <Card decoration="top" decorationColor="indigo" key="unique-key">
        <Table
          dataSource={Monye}
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              key: "id",
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
            },
          ]}
        />
      </Card>
    </div>
  );
}
