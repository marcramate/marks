"use client";

import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { createClient } from "@/utils/supabase/client";
import Monthlyexpenses from "./CostTable";
import { Gmcost, CarTag, CarMiles } from "./CostTable";

export default function TBCost() {
  const supabase = createClient();
  const [tabItems, setTabItems] = useState<TabsProps["items"]>([]);
  const [activeKey, setActiveKey] = useState<string>("1");
  const [company, setCompany] = useState<string>(""); // เพิ่มตัวแปร company
  const [isTab1, setIsTab1] = useState<boolean>(true); // เพิ่มตัวแปร isTab1

  useEffect(() => {
    async function fetchData() {
      try {
        // ดึงข้อมูลจาก Supabase

        let { data: selection, error } = await supabase
          .from("selection")
          .select("company")
          .not("company", "is", null);

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
                  <Monthlyexpenses company={item.company} isTab1={isTab1} />
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

  const onChange = (key: string) => {
    console.log(key);
    setActiveKey(key);
    setCompany(""); // เมื่อเปลี่ยนแท็บให้ reset ค่า company
    setIsTab1(!isTab1); // เมื่อเปลี่ยนแท็บให้สลับค่า isTab1
  };

  return (
    <div>
      <Tabs activeKey={activeKey} onChange={onChange}>
        {tabItems?.map((item) => (
          <Tabs.TabPane key={item.key} tab={item.label}>
            {item.children}
          </Tabs.TabPane>
        ))}

        <Tabs.TabPane key="3" tab="GraceMarc">
          <Gmcost />
        </Tabs.TabPane>

        <Tabs.TabPane key="4" tab="Miles">
          <CarMiles />
        </Tabs.TabPane>
        <Tabs.TabPane key="5" tab="Cars">
          <CarTag />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
