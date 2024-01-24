"use client";
import React, { useEffect, useState } from "react";
import { Tabs, Col, Row, Progress } from "antd";
import type { TabsProps } from "antd";
import { Card, Metric, Text } from "@tremor/react";
import { createClient } from "@/utils/supabase/client";


export default function TabsYoutube() {
  const supabase = createClient();
  const [tabItems, setTabItems] = useState<TabsProps["items"]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // ดึงข้อมูลจาก Supabase
        const { data, error } = await supabase
          .from("youtubepremium")
          .select("*");

        if (error) {
          throw new Error(
            `Error fetching data from Supabase: ${error.message}`
          );
        }

        // ใช้ Array.map เพื่อแปลงข้อมูล
        const newTabItems: TabsProps["items"] =
          data?.map((item, index) => {
            const startMonth = new Date(item.date).getMonth() + 1;
            const endMonth = new Date(item.date_end).getMonth() + 1;
            const monthdiff = endMonth - startMonth;
            const progrmonth = Math.floor(monthdiff * (100 / 12));

            return {
              key: (index + 1).toString(),
              label: item.name,
              children: (
                <Row gutter={16}>
                  <Col span={3}>
                    <Progress
                      type="circle"
                      percent={item.status_pay ? progrmonth : 0}
                    />
                  </Col>

                  <Col span={8}>
                    <Card
                      className="max-w-xs"
                      decoration="left"
                      decorationColor="indigo"
                    >
                      <Text>{item.status_pay ? "จ่ายแล้ว" : "เหลือ"}</Text>
                      <Metric className={item.status_pay ? "Paid" : "Unpaid"}>{monthdiff} เดือน</Metric>
                    </Card>
                  </Col>
                </Row>
              ),
            };
          }) || [];

        setTabItems(newTabItems);
      } catch (error: any) {
        console.error(error.message);
      }
    }

    fetchData();
  }, []);

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div>
      <Tabs defaultActiveKey="1" items={tabItems} onChange={onChange} />
    </div>
  );
}
