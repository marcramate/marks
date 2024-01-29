"use client";

import { SetStateAction, useEffect, useState } from "react";
import { Layout, theme } from "antd";
import { Card } from "@tremor/react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableProps,
  Badge,
  Space,
  Button,
  Tooltip,
  message,
  Modal,
  Form,
  Input,
  DatePicker,
  Switch,
  Spin,
  Flex,
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  CheckOutlined,
  CloseOutlined,
  YoutubeFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { DELYTPM, UPDYTPM } from "@/app/actions";
import dayjs from "dayjs";
import type { DatePickerProps } from "antd";
import TabsYoutube from "../components/YoutubeTabs";

interface DataType {
  key: React.Key;
  id: number;
  name: string;
  date: Date;
  date_end: Date;
  status_pay: boolean;
}

export default function TBYoutubePremium() {
  const supabase = createClient();

  const [YTPremium, setYTPremium] = useState<any>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState<boolean>(false);

  useEffect(() => {
    const fetchYTPM = async () => {
      let { data, error } = await supabase.from("youtubepremium").select("*");

      if (data) {
        setYTPremium(data);
      }

      if (!data || error) {
        console.log("error:", error);
      }
    };
    fetchYTPM();
  }, []);

  useEffect(() => {
    if (editedData) {
      form.setFieldsValue({
        id: editedData.id,
        name: editedData.name,
        date: dayjs(editedData.date),
        dateend: dayjs(editedData.date_end),
        pay_status: editedData.status_pay,
      });
    }
  }, [editedData, form]);

  const handleDel = async (record: any) => {
    try {
      const { id } = record;

      setSpinning(true);

      console.log("id:", id);
      await DELYTPM(id);

      messageApi.success("Success Delete !!");
    } catch (error) {
      console.error("ErrorDel:", error);
      messageApi.error("Error Delete!!!");
    } finally {
      setTimeout(() => {
        setSpinning(false);
        window.location.reload();
      }, 1000);
    }
  };
  useEffect(() => {
    const handleBeforeUnload = () => {
      setSpinning(true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      setTimeout(() => {
        setSpinning(false);
      }, 1800);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const showModal = (record: SetStateAction<null>) => {
    setEditedData(null);
    setEditedData(record);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      if (editedData) {
        const EditData = form.getFieldsValue();
        const EditDataJSON = JSON.stringify(EditData);

        console.log(EditDataJSON);
        await UPDYTPM(EditDataJSON);

        handleCancel(); // หลังจากส่งข้อมูลเสร็จ ปิด Modal
        messageApi.success("Success Update!!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error:", error);
      messageApi.error("Error Update!!!");
    }
  };

  const handleCancel = () => {
    setEditedData(null);
    setIsModalOpen(false);
  };

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const onDate: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const fName: string[] = Array.from(
    new Set(YTPremium.map((dataname1: any) => dataname1.name))
  );

  const statpay: boolean[] = Array.from(
    new Set(YTPremium.map((datastat: any) => datastat.status_pay))
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status Pay",
      dataIndex: "status_pay",
      key: "status_pay",
      render: (status_pay: any) => (status_pay ? "Paid" : "Unpaid"),
    },
  ];

  return (
    <div>
      <Spin
        spinning={spinning}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <div className="mb-4"></div>

        <Card decoration="top" decorationColor="indigo" key="unique-key">
          <Table
            dataSource={YTPremium}
            columns={[
              {
                title: "ID",
                dataIndex: "id",
                key: "id",
                sorter: (id1: { id: number }, id2: { id: number }) =>
                  id1.id - id2.id,
                defaultSortOrder: "ascend", // เรียงลำดับจากน้อยไปมาก
              },
              {
                title: "Name",
                dataIndex: "name",
                key: "name",
                filters: fName.map((name) => ({
                  text: name,
                  value: name,
                })),
                onFilter: (dataname: string, nam: { name: string }) =>
                  nam.name.indexOf(dataname) === 0,
              },
              {
                title: "Month",
                dataIndex: "date",
                key: "date",
                render: (text: string, DB: any) => {
                  const datenew = new Date(DB.date);
                  const dateEnd = new Date(DB.date_end);
                  const formattedDate = `Start Month: ${datenew.toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "2-digit" }
                  )} - End Month: ${dateEnd.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                  })}`;
                  return <span>{formattedDate}</span>;
                },
              },
              {
                title: "Status Pay",
                dataIndex: "status_pay",
                key: "status_pay",
                render: (status_pay: any) => (
                  <Badge
                    status={status_pay ? "success" : "error"}
                    text={status_pay ? "Paid" : "UnPaid"}
                  />
                ),
                filters: statpay.map((status_pay) => ({
                  text: status_pay ? "Paid" : "UnPaid",
                  value: status_pay,
                })),
                onFilter: (datastatus: string, sta: { status_pay: boolean }) =>
                  datastatus ? sta.status_pay : !sta.status_pay,
              },
              {
                title: "",
                key: "action",
                render: (_, record) => (
                  <Space size="middle">
                    {contextHolder}
                    <Tooltip title="Edit">
                      <Button
                        shape="circle"
                        icon={<EditFilled />}
                        size={"small"}
                        onClick={() => showModal(record)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        danger
                        shape="circle"
                        icon={<DeleteFilled />}
                        size={"small"}
                        onClick={() => handleDel(record)}
                      />
                    </Tooltip>
                  </Space>
                ),
              },
            ]}
            onChange={onChange}
          />
        </Card>
        <div className="mb-4"></div>
        <Card decoration="top" decorationColor="indigo">
          <div>
            <TabsYoutube />
          </div>
        </Card>
      </Spin>
      <Spin
        spinning={spinning}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <Modal
          title={
            <div className="flex items-center space-x-1">
              <EditFilled className="mr-2 text-teal-600" />
              Edit Youtube Premium
              <YoutubeFilled className="mr-2 text-red-500" />
            </div>
          }
          open={isModalOpen}
          //onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button shape="round" icon={<CheckOutlined />} onClick={handleOk}>
              Save
            </Button>,
            <Tooltip title="Cancle">
              <Button
                type="primary"
                danger
                icon={<CloseOutlined />}
                onClick={handleCancel}
                shape="circle"
              ></Button>
            </Tooltip>,
          ]}
        >
          <Form
            style={{ maxWidth: 450 }}
            autoComplete="off"
            form={form}
            labelCol={{ span: 4 }}
            //wrapperCol={{ span: 9 }}
          >
            {editedData && (
              <>
                <Form.Item label="ID" name="id" className="mb-4" hidden>
                  <p>{editedData?.id}</p>
                </Form.Item>

                <div className="mb-4"></div>
                <Form.Item label="Name" name="name" className="mb-4">
                  <Input name="name" className="w-full" />
                </Form.Item>

                <Form.Item label="Date" name="date" className="mb-4">
                  <DatePicker
                    onChange={onDate}
                    style={{ width: "100%" }}
                    name="date"
                  />
                </Form.Item>

                <Form.Item label="DateEnd" name="dateend" className="mb-4">
                  <DatePicker
                    onChange={onDate}
                    style={{ width: "100%" }}
                    name="dateend"
                  />
                </Form.Item>

                <Form.Item
                  label="Pay_Status"
                  name="pay_status"
                  className="mb-4"
                >
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    className="bg-red-500"
                  />
                </Form.Item>
              </>
            )}
          </Form>
        </Modal>
      </Spin>
    </div>
  );
}
