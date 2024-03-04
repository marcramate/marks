"use client";
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Badge,
  Skeleton,
  Divider,
  Typography,
  Progress,
  Tabs,
} from "antd";
const { Title, Text } = Typography;
import type { TabsProps } from "antd";
import { createClient } from "@/utils/supabase/client";
import YoutubeshowTabs from "@/components/YoutubeShow";
import SpendShow from "@/components/CostSpend";
import CreditCardShow from "@/components/CrreditCardShow";

export default function Main() {
  const supabase = createClient();
  const [ExPm, setExPm] = useState<any>([]);
  const [ExS, setExS] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [CarMiles, setCarMiles] = useState<any>([]);

  const [tabItems, setTabItems] = useState<TabsProps["items"]>([]);
  const tabsCredit = async () => {
    try {
      setLoading(true);
      let { data: selection, error } = await supabase
        .from("selection")
        .select("creditcard,SalaryCredit")
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
                <Card bordered={true} className="drop-shadow-lg">
                  <Text className="mb-2 font-semibold">
                    {item.creditcard} Limit :{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(item.SalaryCredit)}
                  </Text>

                  <Row gutter={16}>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                      className="mb-2"
                    >
                      {renderCreditCardDetails(
                        item.creditcard,
                        item.SalaryCredit
                      )}
                    </Col>
                  </Row>
                </Card>
              </div>
            ), // เพิ่มข้อมูลเนื้อหาของแท็บตามต้องการ
          };
        }) || [];

      setTabItems(CreditTabs);
    } catch (error) {
      console.error("Error CreditSelect:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    tabsCredit();
  }, []);

  const renderCreditCardDetails = async (
    creditcard: string,
    salaryCredit: number
  ) => {
    try {
      setLoading(true);
      let { data: CreditCardDetails, error } = await supabase
        .from("CreditCard")
        .select("*")
        .like("card", `%${creditcard}%`);

      if (CreditCardDetails) {
        const totalPrice = CreditCardDetails.reduce(
          (accumulator, currentCard) => accumulator + currentCard.price,
          0
        );

        const PayCost = CreditCardDetails.filter(
          (CreditCard: { status: boolean }) => CreditCard.status
        ).reduce(
          (accumulator: number, currentPayCost: { price: number }) =>
            accumulator + currentPayCost.price,
          0
        );

        const WaitCost = CreditCardDetails.filter(
          (CreditCard: { status: boolean }) => !CreditCard.status
        ).reduce(
          (accumulator: number, currentPayCost: { price: number }) =>
            accumulator + currentPayCost.price,
          0
        );
        return (
          <Card bordered={true}>
            <div>
              <span className="text-base font-medium ">
                Total{" - "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(totalPrice))}
              </span>

              <Progress
                key={creditcard}
                percent={salaryCredit ? (totalPrice / salaryCredit) * 100 : 0}
                showInfo={false}
                status="active"
              />
            </div>
            <div>
              <span className="text-base font-medium ">
                Pay{" - "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(PayCost))}
              </span>
              <Progress
                key={creditcard}
                percent={salaryCredit ? (PayCost / salaryCredit) * 100 : 0}
                showInfo={false}
                strokeColor={{ "0%": "#09C728", "100%": "#09C728" }}
              />
            </div>
            <div>
              <span className="text-base font-medium ">
                Wait{" - "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(WaitCost))}
              </span>
              <Progress
                key={creditcard}
                percent={salaryCredit ? (WaitCost / salaryCredit) * 100 : 0}
                showInfo={false}
                strokeColor={{ "0%": "#FF0000", "100%": "#FF0000" }}
              />
            </div>
          </Card>
        );
      }

      if (!CreditCardDetails || error) {
        console.log("ERRORCreditCardDetails :", error);
      }
    } catch (error) {
      console.log("ERRORCreditCardDetails :", error);
    } finally {
      setLoading(false);
    }
  };

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
