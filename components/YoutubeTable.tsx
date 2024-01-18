"use client";

import { useEffect, useState } from "react";
import { Layout, theme } from "antd";
import { Card } from "@tremor/react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableProps,
  Badge,
  Space,
  Button,
  Tooltip,
  message,
} from "antd";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import { DELYTPM } from "@/app/actions";

interface DataType {
  key: React.Key;
  name: string;
  date: Date;
  status_pay: boolean;
}

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
  const [messageApi, contextHolder] = message.useMessage();

  const handleDel = async (record: any) => {
    try {
      const { id } = record;

      console.log("id:", id);
      await DELYTPM(id);

      messageApi.success("Success Delete !!");
      setTimeout(() => {
        window.location.reload();
      }, 1800);
    } catch (error) {
      console.error("ErrorDel:", error);
      messageApi.error("Error Delete!!!");
    }
  };

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
      render: (status_pay: any) => (status_pay ? "Paid" : "Unpaid"),
    },
  ];

  const { Content } = Layout;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const fName: string[] = Array.from(
    new Set(YTPremium.map((dataname1: any) => dataname1.name))
  );

  const statpay: boolean[] = Array.from(
    new Set(YTPremium.map((datastat: any) => datastat.status_pay))
  );

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
                {
                  title: "ID",
                  dataIndex: "id",
                  key: "id",
                  sorter: (id1: { id: number }, id2: { id: number }) =>
                    id1.id - id2.id,
                  defaultSortOrder: "ascend", // เรียงลำดับจากน้อยไปมาก
                },
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                  filters: fName.map((name) => ({
                    text: name,
                    value: name,
                  })),
                  onFilter: (dataname: string, nam: { name: string }) =>
                    nam.name.indexOf(dataname) === 0,
                },
                {
                  title: "Date",
                  dataIndex: "date",
                  key: "date",
                  render: (DB: any) => {
                    const dateStart = new Date(DB.date);
                    const dateEnd = new Date(DB.date_end);
                    const formattedDate = `${dateStart.toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "2-digit" }
                    )} - ${dateEnd.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                    })}`;
                    return <span className="">{formattedDate}</span>;
                  },
                },
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
                  filters: statpay.map((status_pay) => ({
                    text: status_pay ? "Paid" : "UnPaid",
                    value: status_pay,
                  })),
                  onFilter: (
                    datastatus: string,
                    sta: { status_pay: boolean }
                  ) => (datastatus ? sta.status_pay : !sta.status_pay),
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
              onChange={onChange}
            />
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
