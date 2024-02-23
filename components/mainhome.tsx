"use client";
import React, { ReactNode } from "react";
import { Layout, theme } from "antd";

interface MaindashProps {
  children: ReactNode;
}

export default function Maindash({ children }: MaindashProps) {
  const { Content } = Layout;
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
          {children}
        </div>
      </Content>
    </Layout>
  );
}
