"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Layout, theme } from "antd";
import type { TabsProps } from "antd";
import { createClient } from "@/utils/supabase/client";
import Monthlyexpenses from "./CostTable";

export default function TBCost() {
  const supabase = createClient();
  const [tabItems, setTabItems] = useState<TabsProps["items"]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // ดึงข้อมูลจาก Supabase

        let { data: selection, error } = await supabase
          .from("selection")
          .select("*");

        if (error) {
          throw new Error(
            `Error fetching data from Supabase: ${error.message}`
          );
        }

        // ใช้ Array.map เพื่อแปลงข้อมูล
        const newTabItems: TabsProps["items"] =
          selection?.map((item, index) => {
            return {
              key: (index + 1).toString(),
              label: item.company,
              children: (
                <div>
                  <Monthlyexpenses />
                </div>
              ), // เพิ่มข้อมูลเนื้อหาของแท็บตามต้องการ
            };
          }) || [];

        setTabItems(newTabItems);
      } catch (error: any) {
        console.error(error.message);
      }
    }

    fetchData();
  }, []);

  const { Content } = Layout;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onChange = (key: string) => {
    console.log(key);
  };

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
          <Tabs defaultActiveKey="1" onChange={onChange}>
            {tabItems?.map((item) => (
              <Tabs.TabPane key={item.key} tab={item.label}>
                {item.children}
              </Tabs.TabPane>
            ))}

            <Tabs.TabPane key="3" tab="GraceMarc">
              Content of Locked Tab 3
            </Tabs.TabPane>

            <Tabs.TabPane key="4" tab="Miles">
              Content of Locked Tab 4
            </Tabs.TabPane>
            <Tabs.TabPane key="5" tab="Miles">
              Content of Locked Tab 5
            </Tabs.TabPane>
            <Tabs.TabPane key="6" tab="Cars">
              Content of Locked Tab 6
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Content>
    </Layout>
  );
}
