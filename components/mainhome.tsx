"use client";
import React, { ReactNode } from "react";
import { Layout, theme } from "antd";

interface MaindashProps {
  children: ReactNode;
}

export default function Maindash({ children }: MaindashProps) {
  const { Content, Footer } = Layout;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Content style={{ margin: "10px 16px 0" }}>
        <div
          style={{
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="min-h-screen sm:min-h-[1000px] md:min-h-[1100px] lg:min-h-[1100px] xl:min-h-[1100px]"
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
}
