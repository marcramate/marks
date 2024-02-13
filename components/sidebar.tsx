"use client";
import React from "react";
import {
  HeartFilled,
  UserOutlined,
  DribbbleCircleFilled,
  HomeFilled,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import Link from "next/link";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const items = [
  {
    key: "1",
    icon: <UserOutlined />,
    label: "Home",
    link: "/",
  },
  {
    key: "2",
    icon: <HeartFilled style={{ color: "hotpink" }} />,
    label: "Marc Space",
    subItems: [
      {
        key: "2-1",
        label: "Cost",
        link: "/MarcSpace/Cost",
      },
      {
        key: "2-2",
        label: "Youtube Premium",
        link: "/MarcSpace/YoutubePremium",
      },
      {
        key: "2-3",
        label: "Credit Card",
        link: "/MarcSpace/CreditCard",
      },
    ],
  },
];

const Sidebar: React.FC = () => {
  return (
    <Layout>
      <Sider
        style={{ background: "white" }}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="mb-2"></div>
        <div className="text-2xl font-bold text-indigo-600 text-center mb-4">
          <HomeFilled /> Marc
        </div>
        <div className="demo-logo-vertical" />
        <Menu theme="light" mode="inline">
          {items.map((item) => {
            if (item.subItems) {
              return (
                <SubMenu key={item.key} icon={item.icon} title={item.label}>
                  {item.subItems.map((subItem) => (
                    <Menu.Item key={subItem.key}>
                      <Link href={subItem.link}>{subItem.label}</Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
              );
            }

            return (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link href={item.link}>{item.label}</Link>
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>
    </Layout>
  );
};

export default Sidebar;
