// Content.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Row, Col, Card as Carddash, Statistic } from "antd";
import { Card, Metric, Text,Badge } from "@tremor/react";

export default function Main() {
  return (
    <div>
      <Card className="" decoration="top" decorationColor="indigo">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Carddash bordered={true}>
              <div className="grid grid-flow-col justify-stretch">
                
                <Statistic
                  title="All Expenses"
                  value="1000.0"
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
                  suffix="THB"
                />

                <Statistic
                  title="Paid"
                  value="23457.89"
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
                  suffix="THB"
                />

                <Statistic
                  title="Remain"
                  value="23457.89"
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
                  suffix="THB"
                />
              </div>
            </Carddash>
          </Col>

          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <div className="mr-4">
              <Carddash>
                <h1>Mind</h1>
              </Carddash>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
