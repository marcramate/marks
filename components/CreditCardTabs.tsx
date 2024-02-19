"use client";

import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { createClient } from "@/utils/supabase/client";
import CreditCard from "./CreditCardTable";
import { AddCreditCost } from "./CreditCardTable";

export default function CCTabs() {
  const supabase = createClient();
  const [tabItems, setTabItems] = useState<TabsProps["items"]>([]);
  const [activeKey, setActiveKey] = useState<string>("1");
  const [creditcard, setCreditcard] = useState<string>(""); // เพิ่มตัวแปร company
  const [isTab1, setIsTab1] = useState<boolean>(true); // เพิ่มตัวแปร isTab1

  const tabsCredit = async () => {
    try {
      let { data: selection, error } = await supabase
        .from("selection")
        .select("creditcard")
        .not("creditcard", "is", null);

      console.log("CCTab", selection);

      if (error) {
        throw new Error(`Error fetching data from Supabase: ${error.message}`);
      }

      // ใช้ Array.map เพื่อแปลงข้อมูล
      const CreditTabs: TabsProps["items"] =
        selection?.map((item, index) => {
          return {
            key: (index + 1).toString(),
            label: item.creditcard,
            children: (
              <div>
                <CreditCard creditcard={item.creditcard} isTab1={isTab1} />
              </div>
            ), // เพิ่มข้อมูลเนื้อหาของแท็บตามต้องการ
          };
        }) || [];

      setTabItems(CreditTabs);
    } catch (error) {
      console.error("Error CreditSelect:", error);
    }
  };

  useEffect(() => {
    tabsCredit();
  }, []);

  const onChange = (key: string) => {
    console.log(key);
    setActiveKey(key);
    setCreditcard("");
    setIsTab1(!isTab1);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4">
      <Tabs
        activeKey={activeKey}
        onChange={onChange}
        tabBarExtraContent={<AddCreditCost />}
        //className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4"
      >
        {tabItems?.map((item) => (
          <Tabs.TabPane key={item.key} tab={item.label}>
            {item.children}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
}
