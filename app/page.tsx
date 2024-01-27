// Content.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Layout, theme } from "antd";
import { Card, Metric, Text } from "@tremor/react";

const { Content } = Layout;

const Main: React.FC = () => {
  //console.log("Children:", children);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
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
          <h1> Mind 4Eve</h1>
        </div>
      </Content>
    </Layout>
  );
};

export default Main;
