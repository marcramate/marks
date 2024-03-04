"use client";
import React, { useEffect, useState } from "react";
import { Card, Badge, Skeleton, Divider, Tabs } from "antd";
import type { TabsProps } from "antd";
import { createClient } from "@/utils/supabase/client";
import YoutubeshowTabs from "@/components/YoutubeShow";
import SpendShow from "@/components/CostSpend";
import CreditCardShow from "@/components/CrreditCardShow";

export default function Main() {
  const [loading, setLoading] = useState<boolean>(true);

  const loadsim = async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000);
    setLoading(false);
  };
  useEffect(() => {
    loadsim();
  }, []);

  /*
  useEffect(() => {
    const intervalId = setInterval(() => {
      PMGF();
      Carmilesfe();
      console.log("useEffect with setInterval executed");
    }, 36000); // 60000 มิลลิวินาทีหรือ 1 นาที

    return () => clearInterval(intervalId);
  }, [ExPm]);
*/

  const tabs: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <Badge color="#3f8600" text="Credit" className="mb-2 font-normal" />
      ),
      children: <div>{loading ? <Skeleton active /> : <CreditCardShow />}</div>,
    },
    {
      key: "2",
      label: (
        <Badge color="#cf1322" text="Youtube" className="mb-2 font-normal" />
      ),
      children: (
        <div>
          {loading ? (
            <Skeleton active />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4">
              <Card bordered={true} className="drop-shadow-lg">
                <YoutubeshowTabs dele={0} />
              </Card>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "3",
      label: <Badge color="#f50" text="Spend" className="mb-2 font-normal" />,
      children: (
        <div>
          {loading ? <Skeleton active /> : <SpendShow />}
          <Divider />
        </div>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <Skeleton active />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4">
          <Tabs defaultActiveKey="1" items={tabs} />
        </div>
      )}
    </div>
  );
}
