"use client";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Badge, Skeleton } from "antd";
import { createClient } from "@/utils/supabase/client";

export default function SpendShow() {
  const supabase = createClient();
  const [ExPm, setExPm] = useState<any>([]);
  const [ExS, setExS] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [CarMiles, setCarMiles] = useState<any>([]);

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

  const Carmilesfe = async () => {
    try {
      setLoading(true);
      let { data: car, error } = await supabase
        .from("car")
        .select("*")
        .not("c_miles", "is", null);

      if (car) {
        setCarMiles(car);
      }
      if (!car || error) {
        console.log("CarTag:", error);
      }
      console.log("Ok Date Carmilesfe", car);
    } catch (error) {
      console.error("Error Carmilesfe:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    PMGF();
    Carmilesfe();
  }, []);

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

  const totalV = CarMiles.filter(
    (car_v: { c_name: string }) => car_v.c_name === "Vios"
  ).reduce((accumulator: any, car_v: { c_price: any }) => {
    return accumulator + car_v.c_price;
  }, 0);

  const totalVM = CarMiles.filter(
    (car_v: { c_name: string }) => car_v.c_name === "Vios"
  ).reduce((accumulator: any, car_v: { c_miles: any }) => {
    return accumulator + car_v.c_miles;
  }, 0);

  const totalJ = CarMiles.filter(
    (car_v: { c_name: string }) => car_v.c_name === "Jupiter"
  ).reduce((accumulator: any, car_v: { c_price: any }) => {
    return accumulator + car_v.c_price;
  }, 0);

  const totalJM = CarMiles.filter(
    (car_v: { c_name: string }) => car_v.c_name === "Jupiter"
  ).reduce((accumulator: any, car_v: { c_miles: any }) => {
    return accumulator + car_v.c_miles;
  }, 0);

  return (
    <div>
      {loading ? (
        <Skeleton active />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          <Card bordered={true} className="drop-shadow-lg">
            <Badge
              color="#f50"
              text="ค่าใช้จ่าย"
              className="mb-2 font-semibold"
            />
            <Row gutter={16}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-2">
                <Badge.Ribbon text="Premier Gold" color="#0866c6">
                  <Card bordered={true}>
                    <Statistic
                      title="All"
                      value={AllPm}
                      precision={2}
                      suffix="THB"
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-2">
                <Badge.Ribbon text="Premier Gold" color="#0866c6">
                  <Card bordered={true}>
                    <Statistic
                      title="Paid"
                      value={PaidPm}
                      precision={2}
                      valueStyle={{ color: "#3f8600" }}
                      suffix="THB"
                      className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-2">
                <Badge.Ribbon text="Premier Gold" color="#0866c6">
                  <Card bordered={true}>
                    <Statistic
                      title="Remain"
                      value={UnPaidPm}
                      precision={2}
                      valueStyle={{ color: "#cf1322" }}
                      suffix="THB"
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
              {/* S11 */}
              <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-2">
                <Badge.Ribbon text="S11" color="#086935">
                  <Card bordered={true}>
                    <Statistic
                      title="All"
                      value={AllS}
                      precision={2}
                      suffix="THB"
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-2">
                <Badge.Ribbon text="S11" color="#086935">
                  <Card bordered={true}>
                    <Statistic
                      title="Paid"
                      value={PaidS}
                      precision={2}
                      valueStyle={{ color: "#3f8600" }}
                      suffix="THB"
                      className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-2">
                <Badge.Ribbon text="S11" color="#086935">
                  <Card bordered={true}>
                    <Statistic
                      title="Remain"
                      value={UnPaidS}
                      precision={2}
                      valueStyle={{ color: "#cf1322" }}
                      suffix="THB"
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
            </Row>
          </Card>

          {/* Car Vios*/}
          <Card bordered={true} className="drop-shadow-lg">
            <Badge color="#f50" text="Car" className="mb-2 font-semibold" />
            <Row gutter={16}>
              <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-2">
                <Badge.Ribbon text="Vios" color="#0866c6">
                  <Card bordered={true}>
                    <Statistic
                      title="Cost"
                      value={totalV}
                      valueStyle={{ color: "#3f8600" }}
                      precision={2}
                      suffix="THB"
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-2">
                <Badge.Ribbon text="Vios" color="#0866c6">
                  <Card bordered={true}>
                    <Statistic
                      title="Miles"
                      value={totalVM}
                      precision={2}
                      valueStyle={{ color: "#3f8600" }}
                      suffix="THB"
                      className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
              {/*Car Jupiter*/}
              <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-2">
                <Badge.Ribbon text="Jupiter" color="#0866c6">
                  <Card bordered={true}>
                    <Statistic
                      title="Cost"
                      value={totalJ}
                      valueStyle={{ color: "#3f8600" }}
                      precision={2}
                      suffix="THB"
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-2">
                <Badge.Ribbon text="Jupiter" color="#0866c6">
                  <Card bordered={true}>
                    <Statistic
                      title="Miles"
                      value={totalJM}
                      precision={2}
                      valueStyle={{ color: "#3f8600" }}
                      suffix="THB"
                      className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
            </Row>
          </Card>
        </div>
      )}
    </div>
  );
}
