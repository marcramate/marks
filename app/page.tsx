"use client";
import React, { useEffect, useState } from "react";
import { Row, Col, Card as Carddash, Statistic, Badge, Skeleton } from "antd";
import { Card } from "@tremor/react";
import { createClient } from "@/utils/supabase/client";

export default function Main() {
  const supabase = createClient();
  const [ExPm, setExPm] = useState<any>([]);
  const [ExS, setExS] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const PMGF = async () => {
    try {
      setLoading(true);
      let { data: expenses, error } = await supabase
        .from("expenses")
        .select("*")
        .like("company", "%Premier Gold%");

      let { data: expensesS, error: errorS } = await supabase
        .from("expenses")
        .select("*")
        .like("company", "%S11%");

      if (expenses || expensesS) {
        setExPm(expenses);
        setExS(expensesS);
      }

      if (!expenses || !expensesS) {
        console.log("Error Data P:", error, "Error Data S:", errorS);
      }
      console.log("Ok Data P:", expenses, "Ok Data S:", expensesS);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    PMGF();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      PMGF();
      console.log("useEffect with setInterval executed");
    }, 36000); // 60000 มิลลิวินาทีหรือ 1 นาที

    return () => clearInterval(intervalId);
  }, [ExPm]);

  //All
  const AllPm = ExPm.reduce((collectPma: any, ExpexPma: { cost: any }) => {
    return collectPma + ExpexPma.cost;
  }, 0);

  const AllS = ExS.reduce((collectS: any, ExpexS: { cost: any }) => {
    return collectS + ExpexS.cost;
  }, 0);

  //true
  const PaidPm = ExPm.filter((sta_ex: { status: any }) => sta_ex.status).reduce(
    (collectPmp: any, ExpexPmp: { cost: any }) => {
      return collectPmp + ExpexPmp.cost;
    },
    0
  );

  const PaidS = ExS.filter((sta_ex: { status: any }) => sta_ex.status).reduce(
    (collects: any, Expexs: { cost: any }) => {
      return collects + Expexs.cost;
    },
    0
  );
  //false
  const UnPaidPm = ExPm.filter(
    (sta_ex: { status: any }) => !sta_ex.status
  ).reduce((collectPmu: any, ExpexPmu: { cost: any }) => {
    return collectPmu + ExpexPmu.cost;
  }, 0);

  const UnPaidS = ExS.filter(
    (sta_ex: { status: any }) => !sta_ex.status
  ).reduce((collectsu: any, Expexsu: { cost: any }) => {
    return collectsu + Expexsu.cost;
  }, 0);

  return (
    <div className="flex flex-wrap">
      {loading ? (
        <Skeleton active /> // Render loading state while data is being fetched
      ) : (
        <Row gutter={16}>
          {/* Left Section */}
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-2">
            <Card decoration="top" decorationColor="indigo">
              <Col span={24}>
                <div className="mb-2">
                  <Badge.Ribbon text="Premier Gold" color="magenta">
                    <Carddash bordered={true}>
                      <div className="grid grid-flow-col justify-stretch">
                        <Statistic
                          title="All Expenses"
                          value={AllPm}
                          precision={2}
                          suffix="THB"
                        />
                      </div>
                    </Carddash>
                  </Badge.Ribbon>
                </div>
              </Col>

              <Col span={24}>
                <div className="mb-2">
                  <Badge.Ribbon text="Premier Gold" color="magenta">
                    <Carddash bordered={true}>
                      <div className="grid grid-flow-col justify-stretch">
                        <Statistic
                          title="Paid"
                          value={PaidPm}
                          precision={2}
                          valueStyle={{ color: "#3f8600" }}
                          suffix="THB"
                        />
                      </div>
                    </Carddash>
                  </Badge.Ribbon>
                </div>
              </Col>

              <Col span={24}>
                <Badge.Ribbon text="Premier Gold" color="magenta">
                  <Carddash bordered={true}>
                    <div className="grid grid-flow-col justify-stretch">
                      <Statistic
                        title="Remain"
                        value={UnPaidPm}
                        precision={2}
                        valueStyle={{ color: "#cf1322" }}
                        suffix="THB"
                      />
                    </div>
                  </Carddash>
                </Badge.Ribbon>
              </Col>
            </Card>
          </Col>

          {/* Right Section */}
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Card decoration="top" decorationColor="indigo">
              <Col span={24}>
                <div className="mb-2">
                  <Badge.Ribbon text="S11" color="green">
                    <Carddash bordered={true}>
                      <div className="grid grid-flow-col justify-stretch">
                        <Statistic
                          title="All Expenses"
                          value={AllS}
                          precision={2}
                          valueStyle={{ color: "#cf1322" }}
                          suffix="THB"
                        />
                      </div>
                    </Carddash>
                  </Badge.Ribbon>
                </div>
              </Col>

              <Col span={24}>
                <div className="mb-2">
                  <Badge.Ribbon text="S11" color="green">
                    <Carddash bordered={true}>
                      <div className="grid grid-flow-col justify-stretch">
                        <Statistic
                          title="All Expenses"
                          value={PaidS}
                          precision={2}
                          valueStyle={{ color: "#cf1322" }}
                          suffix="THB"
                        />
                      </div>
                    </Carddash>
                  </Badge.Ribbon>
                </div>
              </Col>

              <Col span={24}>
                <Badge.Ribbon text="S11" color="green">
                  <Carddash bordered={true}>
                    <div className="grid grid-flow-col justify-stretch">
                      <Statistic
                        title="All Expenses"
                        value={UnPaidS}
                        precision={2}
                        valueStyle={{ color: "#cf1322" }}
                        suffix="THB"
                      />
                    </div>
                  </Carddash>
                </Badge.Ribbon>
              </Col>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
