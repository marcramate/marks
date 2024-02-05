"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import {
  Table,
  Badge,
  Col,
  Row,
  Statistic,
  Card as Cardantd,
  Space,
  Tooltip,
  Button,
  Modal,
  Form,
  Switch,
  Input,
  Select,
  InputNumber,
  message,
  Spin,
  Tag,
  DatePicker,
  DatePickerProps,
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Card } from "@tremor/react";
import { createClient } from "@/utils/supabase/client";

import MDexpesescost from "./CostModal";
import {
  UPDEXPM,
  DELEXPM,
  STATUPIDPM,
  UPDXGM,
  DELEXGM,
  UPDCartag,
} from "@/app/actions";
import { Gmmodal, Cartagmodal } from "./CostModal";

interface DataType {
  key: React.Key;
  id: number;
  text: string;
  company: string;
  cost: number;
  status: boolean;
}

interface MonthlyexpensesProps {
  company: string;
  isTab1: boolean;
}
export default function Monthlyexpenses({
  company,
  isTab1,
}: MonthlyexpensesProps) {
  const supabase = createClient();
  const [Monye, setMoye] = useState<any>([]);
  const [spinning, setSpinning] = useState<boolean>(false);

  const fetchPM = async () => {
    let { data: expenses, error } = await supabase
      .from("expenses")
      .select("*")
      .like("company ", `%${company}%`);

    if (expenses) {
      setMoye(expenses);
    }

    if (!expenses || error) {
      console.log("PM :", error);
    }
  };

  useEffect(() => {
    fetchPM();
  }, [company, isTab1]);

  const totalCost = Monye.reduce(
    (accumulator: any, currentExpense: { cost: any }) => {
      return accumulator + currentExpense.cost;
    },
    0
  );

  //true
  const PaidCost = Monye.filter(
    (expense: { status: any }) => expense.status
  ).reduce((accumulator: any, currentExpense: { cost: any }) => {
    return accumulator + currentExpense.cost;
  }, 0);

  //false
  const UnPaidCost = Monye.filter(
    (expense: { status: any }) => !expense.status
  ).reduce((accumulator: any, currentExpense: { cost: any }) => {
    return accumulator + currentExpense.cost;
  }, 0);

  const [messageApi, contextHolder] = message.useMessage();
  const [editedDataPm, setEditedDataPm] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (editedDataPm) {
      form.setFieldsValue({
        id: editedDataPm.id,
        text: editedDataPm.text,
        cost: editedDataPm.cost,
        company: editedDataPm.company,
        status: editedDataPm.status,
      });
    }
  }, [editedDataPm, form]);

  const showModal = (record: SetStateAction<null> | { id: number }) => {
    setEditedDataPm(null);
    setEditedDataPm(record);
    setIsModalOpen(true);
  };

  const handleDel = async (record: any) => {
    try {
      const { id } = record;

      console.log("id:", id);
      setSpinning(true);
      await DELEXPM(id);

      setTimeout(() => {
        fetchPM();
        setSpinning(false);
      }, 1000);

      messageApi.success("Success Delete !!");
    } catch (error) {
      console.error("ErrorDel:", error);
      setSpinning(false);
      messageApi.error("Error Delete!!!");
    }
  };

  const handleStatus = async (record: any) => {
    try {
      const { id, status } = record;

      console.log("ID:", id, "Status:", status);

      setSpinning(true);
      await STATUPIDPM(id, status);

      setTimeout(() => {
        fetchPM();
        setSpinning(false);
      }, 1000);

      messageApi.success("Success Update Status");
    } catch (error) {
      console.log("ErrorStatus:", error);
      setSpinning(false);
      messageApi.error("Error UpdateStatus!!!");
    }
  };

  const handleCancel = () => {
    setEditedDataPm(null);
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      if (editedDataPm) {
        const EditPm = form.getFieldsValue();
        const EditJSONPm = JSON.stringify(EditPm);

        console.log(EditJSONPm);
        setSpinning(true);
        await UPDEXPM(EditJSONPm);

        handleCancel(); // หลังจากส่งข้อมูลเสร็จ ปิด Modal

        setTimeout(() => {
          fetchPM();
          setSpinning(false);
        }, 1000);
        messageApi.success("Success Update EXPM!!");
      }
    } catch (error) {
      console.error("Error:", error);
      setSpinning(false);
      messageApi.error("Error Update!!!");
    }
  };

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Cardantd bordered={true}>
            <Statistic
              title="All Expenses"
              value={totalCost}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              suffix="THB"
            />
          </Cardantd>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Cardantd bordered={true}>
            <Statistic
              title="Paid"
              value={PaidCost}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              suffix="THB"
            />
          </Cardantd>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Cardantd bordered={true}>
            <Statistic
              title="Remain"
              value={UnPaidCost}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              suffix="THB"
            />
          </Cardantd>
        </Col>
      </Row>

      <div className="mb-4"></div>
      <Spin
        spinning={spinning}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <Card decoration="left" decorationColor="indigo" key="unique-key">
          <MDexpesescost company={company} isTab1={isTab1} />
          <Table
            dataSource={Monye}
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
                title: "List",
                dataIndex: "text",
                key: "text",
              },
              {
                title: "Company",
                dataIndex: "company",
                key: "company",
              },
              {
                title: "Cost",
                dataIndex: "cost",
                key: "cost",
                render: (cost: number) => (
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(cost)}
                  </span>
                ),
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (status: any) => (
                  <Badge
                    status={status ? "success" : "error"}
                    text={status ? "Paid" : "UnPaid"}
                  />
                ),
              },
              {
                title: "",
                key: "action",
                render: (_, record) => (
                  <Space size="middle">
                    {contextHolder}
                    <Tooltip title="UpdateStatus">
                      <Button
                        className="buttonUpStatus"
                        shape="round"
                        icon={<CheckOutlined className="text-green-700" />}
                        size={"small"}
                        onClick={() => handleStatus(record)}
                      >
                        UpdateStatus
                      </Button>
                    </Tooltip>
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
          />
        </Card>

        <Modal
          title={
            <div className="flex items-center space-x-1">
              <EditFilled className="mr-2 text-teal-600" />
              Edit Expenses
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
            {editedDataPm && (
              <>
                <Form.Item label="ID" name="id" className="mb-4" hidden>
                  <p>{editedDataPm?.id}</p>
                </Form.Item>

                <div className="mb-4"></div>
                <Form.Item label="List" name="text">
                  <Input name="text" className="w-full" />
                </Form.Item>

                <Form.Item label="Company" name="company" className="mb-4">
                  <Select
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    disabled
                  />
                </Form.Item>

                <Form.Item
                  label="Cost"
                  name="cost"
                  className="mb-4"
                  initialValue={0}
                  rules={[
                    {
                      type: "number",
                      message: "Please input a valid number",
                    },
                  ]}
                >
                  <InputNumber
                    prefix="THB"
                    className="w-full"
                    name="cost"
                    formatter={(value) => (value ? `${value}` : "0")}
                    parser={(value) => (value ? parseFloat(value) : 0)}
                  />
                </Form.Item>

                <Form.Item label="Status" name="status">
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

export function Gmcost() {
  const supabase = createClient();
  const [Gmexp, setGmxp] = useState<any>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [editedDataGm, setEditedDataGm] = useState<any>(null);
  const Gme = async () => {
    try {
      let { data: expenses, error } = await supabase
        .from("expenses")
        .select("*")
        .like("company", "%GraceMarc%");

      if (expenses) {
        setGmxp(expenses);
      }
      if (!expenses || error) {
        console.log("GM:", error);
      }
    } catch (error) {
      console.error("Error GM:", error);
    }
  };

  useEffect(() => {
    Gme();
  }, []);

  useEffect(() => {
    if (editedDataGm) {
      form.setFieldsValue({
        id: editedDataGm.id,
        text: editedDataGm.text,
        cost: editedDataGm.cost,
        company: editedDataGm.company,
        status: editedDataGm.status,
      });
    }
  }, [editedDataGm, form]);

  const showModal = (record: SetStateAction<null> | { id: number }) => {
    setEditedDataGm(null);
    setEditedDataGm(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setEditedDataGm(null);
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      if (editedDataGm) {
        const EditGm = form.getFieldsValue();
        const EditJSONGm = JSON.stringify(EditGm);

        console.log(EditJSONGm);
        setSpinning(true);
        await UPDXGM(EditJSONGm);

        handleCancel(); // หลังจากส่งข้อมูลเสร็จ ปิด Modal

        setTimeout(() => {
          Gme();
          setSpinning(false);
        }, 1000);
        messageApi.success("Success Update EXPM!!");
      }
    } catch (error) {
      console.error("Error:", error);
      setSpinning(false);
      messageApi.error("Error Update!!!");
    }
  };

  const handleDel = async (record: any) => {
    try {
      const { id } = record;

      console.log("id:", id);
      setSpinning(true);
      await DELEXGM(id);

      setTimeout(() => {
        Gme();
        setSpinning(false);
      }, 1000);

      messageApi.success("Success Delete !!");
    } catch (error) {
      console.error("ErrorDel:", error);
      setSpinning(false);
      messageApi.error("Error Delete!!!");
    }
  };
  const totalGm = Gmexp.reduce((accumulator: any, current: { cost: any }) => {
    return accumulator + current.cost;
  }, 0);

  const totalGmSh =
    Gmexp.reduce((accumulator: any, current: { cost: any }) => {
      return accumulator + current.cost;
    }, 0) / 2;

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Cardantd bordered={true}>
            <Statistic
              title="All Expenses"
              value={totalGm}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              suffix="THB"
            />
          </Cardantd>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Cardantd bordered={true}>
            <Statistic
              title="Share"
              value={totalGmSh}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              suffix="THB"
            />
          </Cardantd>
        </Col>
      </Row>

      <div className="mb-4" />
      <Spin
        spinning={spinning}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <Card decoration="top" decorationColor="indigo" key="unique-key">
          <Gmmodal />
          <Table
            dataSource={Gmexp}
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
                title: "List",
                dataIndex: "text",
                key: "text",
              },
              {
                title: "Choice",
                dataIndex: "company",
                key: "company",
              },
              {
                title: "Cost",
                dataIndex: "cost",
                key: "cost",
                render: (cost: number) => (
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(cost)}
                  </span>
                ),
              },
              {
                title: "Share",
                key: "Share",
                render: (record: { cost: number }) => (
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(record.cost / 2)}
                  </span>
                ),
              },
              {
                title: "Date",
                key: "date",
                render: () => {
                  const nowDate = dayjs();
                  const fomatD = nowDate.format("MM/YYYY");
                  return <Tag color="geekblue">{fomatD}</Tag>;
                },
              },

              {
                title: "",
                key: "action",
                render: (_, record) => (
                  <Space size="middle">
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
          />
        </Card>

        <Modal
          title={
            <div className="flex items-center space-x-1">
              <EditFilled className="mr-2 text-teal-600" />
              Edit Expenses GraceMarc
            </div>
          }
          open={isModalOpen}
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
            {editedDataGm && (
              <>
                <Form.Item label="ID" name="id" className="mb-4" hidden>
                  <p>{editedDataGm?.id}</p>
                </Form.Item>

                <div className="mb-4"></div>
                <Form.Item label="List" name="text">
                  <Input name="text" className="w-full" />
                </Form.Item>

                <Form.Item label="Company" name="company" className="mb-4">
                  <Select
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    disabled
                  />
                </Form.Item>

                <Form.Item
                  label="Cost"
                  name="cost"
                  className="mb-4"
                  initialValue={0}
                  rules={[
                    {
                      type: "number",
                      message: "Please input a valid number",
                    },
                  ]}
                >
                  <InputNumber
                    prefix="THB"
                    className="w-full"
                    name="cost"
                    formatter={(value) => (value ? `${value}` : "0")}
                    parser={(value) => (value ? parseFloat(value) : 0)}
                  />
                </Form.Item>
                <div className="hidden">
                  <Form.Item label="Status" name="status">
                    <Switch
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      className="bg-red-500"
                    />
                  </Form.Item>
                </div>
              </>
            )}
          </Form>
        </Modal>
      </Spin>
    </div>
  );
}

export function CarTag() {
  const supabase = createClient();
  const [CarTag, setCarTag] = useState<any>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [editedDataCarTag, setEditedDataCarTag] = useState<any>(null);
  const [Scta, setScta] = useState<any>([]);
  const [Carname, setcarname] = useState<any>([]);

  const CarTagData = async () => {
    try {
      let { data: car, error } = await supabase
        .from("car")
        .select("*")
        .not("c_tag", "is", null);

      if (car) {
        setCarTag(car);
      }
      if (!car || error) {
        console.log("CarTag:", error);
      }
    } catch (error) {
      console.error("Error CarTag:", error);
    }
  };

  const carname = async () => {
    let { data: selectcar, error } = await supabase
      .from("selection")
      .select("car")
      .not("car", "is", null);

    if (selectcar) {
      setcarname(selectcar);
      const carmam = selectcar.map(({ car }) => ({
        value: car,
        label: car,
      }));
      setcarname(carmam);
      console.log(carmam);
    }

    if (!selectcar || error) {
      console.log("car :", error);
    }
  };

  const tagcar = async () => {
    let { data: selectcartag, error } = await supabase
      .from("selection")
      .select("car_tag");

    if (selectcartag) {
      setScta(selectcartag);
      const scartag = selectcartag.map(({ car_tag }) => ({
        value: car_tag,
        label: car_tag,
      }));
      setScta(scartag);
      console.log(scartag);
    }

    if (!selectcartag || error) {
      console.log("tagcar :", error);
    }
  };
  useEffect(() => {
    CarTagData();
    tagcar();
    carname();
  }, []);

  useEffect(() => {
    if (editedDataCarTag) {
      form.setFieldsValue({
        id: editedDataCarTag.id,
        c_name: editedDataCarTag.c_name,
        c_price: editedDataCarTag.c_price,
        c_startdate: dayjs(editedDataCarTag.c_startdate),
        c_enddate: dayjs(editedDataCarTag.c_enddate),
        c_tag: editedDataCarTag.c_tag,
      });
    }
  }, [editedDataCarTag, form]);

  const showModal = (record: SetStateAction<null> | { id: number }) => {
    setEditedDataCarTag(null);
    setEditedDataCarTag(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setEditedDataCarTag(null);
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      if (editedDataCarTag) {
        const EditCarTag = form.getFieldsValue();
        const EditJSONcartag = JSON.stringify(EditCarTag);

        console.log(EditJSONcartag);
        setSpinning(true);
        await UPDCartag(EditJSONcartag);

        handleCancel(); // หลังจากส่งข้อมูลเสร็จ ปิด Modal

        setTimeout(() => {
          //Gme();
          setSpinning(false);
        }, 1000);
        messageApi.success("Success Update Cartag!!");
      }
    } catch (error) {
      console.error("Error:", error);
      setSpinning(false);
      messageApi.error("Error Update Cartag!!!");
    }
  };

  const handleDel = async (record: any) => {
    try {
      const { id } = record;

      console.log("id:", id);
      setSpinning(true);
      //await DELEXGM(id);

      setTimeout(() => {
        //Gme();
        setSpinning(false);
      }, 1000);

      messageApi.success("Success Delete !!");
    } catch (error) {
      console.error("ErrorDel:", error);
      setSpinning(false);
      messageApi.error("Error Delete!!!");
    }
  };

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const ondateend = (date: any, dateString: string) => {
    const newDateend = dayjs(dateString).add(1, "year");
    form.setFieldsValue({ c_enddate: newDateend });
  };

  /*
  const totalGm = Gmexp.reduce((accumulator: any, current: { cost: any }) => {
    return accumulator + current.cost;
  }, 0);

  const totalGmSh =
    Gmexp.reduce((accumulator: any, current: { cost: any }) => {
      return accumulator + current.cost;
    }, 0) / 2;
    */

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Cardantd bordered={true}>
            <Statistic
              title="All Expenses"
              value="5"
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              suffix="THB"
            />
          </Cardantd>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Cardantd bordered={true}>
            <Statistic
              title="Share"
              value="d"
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              suffix="THB"
            />
          </Cardantd>
        </Col>
      </Row>

      <div className="mb-4" />
      <Spin
        spinning={spinning}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <Card decoration="top" decorationColor="indigo" key="unique-key">
          <Cartagmodal />
          <Table
            dataSource={CarTag}
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
                dataIndex: "c_name",
                key: "c_name",
              },
              {
                title: "Tag",
                dataIndex: "c_tag",
                key: "c_tag",
              },
              {
                title: "Price",
                dataIndex: "c_price",
                key: "c_price",
                render: (c_price: number) => (
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(c_price)}
                  </span>
                ),
              },
              {
                title: "StarDate",
                dataIndex: "c_startdate",
                key: "c_startdate",
                render: (c_stardate) => {
                  const fomatsd = dayjs(c_stardate).format("DD/MM/YYYY");
                  return <Tag color="#87d068">{fomatsd}</Tag>;
                },
              },
              {
                title: "EndDate",
                dataIndex: "c_enddate",
                key: "c_enddate",
                render: (c_enddate) => {
                  const fomated = dayjs(c_enddate).format("DD/MM/YYYY");
                  return <Tag color="#f50">{fomated}</Tag>;
                },
              },

              {
                title: "",
                key: "action",
                render: (_, record) => (
                  <Space size="middle">
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
          />
        </Card>

        <Modal
          title={
            <div className="flex items-center space-x-1">
              <EditFilled className="mr-2 text-teal-600" />
              Edit CarTag
            </div>
          }
          open={isModalOpen}
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
            {editedDataCarTag && (
              <>
                <Form.Item label="ID" name="id" className="mb-4" hidden>
                  <p>{editedDataCarTag?.id}</p>
                </Form.Item>

                <div className="mb-4"></div>
                <Form.Item label="Car" name="c_name">
                  <Select
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    options={Carname}
                  />
                </Form.Item>

                <Form.Item label="CarTag" name="c_tag" className="mb-4">
                  <Select
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    options={Scta}
                  />
                </Form.Item>

                <Form.Item label="Price" name="c_price" className="mb-4">
                  <InputNumber
                    prefix="THB"
                    className="w-full"
                    name="c_price"
                    formatter={(value) => (value ? `${value}` : "0")}
                    parser={(value) => (value ? parseFloat(value) : 0)}
                  />
                </Form.Item>
                <Form.Item label="Date" name="c_startdate" className="mb-4">
                  <DatePicker
                    onChange={ondateend}
                    style={{ width: "100%" }}
                    name="c_startdate"
                  />
                </Form.Item>

                <Form.Item label="DateEnd" name="c_enddate" className="mb-4">
                  <DatePicker
                    onChange={onChange}
                    style={{ width: "100%" }}
                    name="c_enddate"
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
