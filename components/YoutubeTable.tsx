"use client";

import { useEffect, useState } from "react";
import { Layout, theme } from "antd";
import { Card } from "@tremor/react";
import { createClient } from "@/utils/supabase/client";
import { Table, Badge, Space, Button, Tooltip } from "antd";
import { DeleteOutlined, EditFilled, DeleteFilled } from "@ant-design/icons";

export default function TBYoutubePremium() {
  const supabase = createClient();

  const [YTPremium, setYTPremium] = useState<any>([]);

  useEffect(() => {
    const fetchYTPM = async () => {
      let { data, error } = await supabase.from("youtubepremium").select("*");

      if (!data || error) {
        console.log("error:", error);
      }
      setYTPremium(data);
    };
    fetchYTPM();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status Pay",
      dataIndex: "status_pay",
      key: "status_pay",
      render: (status_pay: any) => (status_pay ? "Paid" : "Unpaid"), // แปลงค่า boolean เป็นข้อความ
    },
  ];

  const { Content } = Layout;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Content style={{ margin: "10px 16px 0" }}>
        <div
          style={{
            padding: 24,
            minHeight: 887,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Card decoration="top" decorationColor="indigo" key="unique-key">
            <Table
              dataSource={YTPremium}
              columns={[
                { title: "ID", dataIndex: "id", key: "id" },
                { title: "Name", dataIndex: "name", key: "name" },
                { title: "Date", dataIndex: "date", key: "date" },
                {
                  title: "Status Pay",
                  dataIndex: "status_pay",
                  key: "status_pay",
                  render: (status_pay: any) => (
                    <Badge
                      status={status_pay ? "success" : "error"}
                      text={status_pay ? "Paid" : "UnPaid"}
                    />
                  ),
                },
                {
                  title: "Action",
                  key: "action",
                  render: (_, record) => (
                    <Space size="middle">
                      <Tooltip title="Edit">
                        <Button
                          shape="circle"
                          icon={<EditFilled />}
                          size={"small"}
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Button
                          danger
                          shape="circle"
                          icon={<DeleteFilled />}
                          size={"small"}
                        />
                      </Tooltip>
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
