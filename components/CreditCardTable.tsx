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
  Progress,
} from "antd";
import {
  EditFilled,
  DeleteFilled,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  DownloadOutlined,
  BarsOutlined,
  PlusOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Card } from "@tremor/react";
import { createClient } from "@/utils/supabase/client";
import * as XLSX from "xlsx";
import { CreditCostAdd, UPDCredit, DelCredit, STATCREDIT } from "@/app/actions";

interface CreditCardProps {
  creditcard: string;
  isTab1: boolean;
}

const purc_type = [
  {
    value: "เงินสด",
    label: "เงินสด",
  },
  {
    value: "ผ่อน",
    label: "ผ่อน",
  },
];

const type = [
  {
    value: "น้ำมัน",
    label: "น้ำมัน",
  },
  {
    value: "น้ำ",
    label: "น้ำ",
  },
  {
    value: "อาหาร",
    label: "อาหาร",
  },
  {
    value: "เสื้อผ้า",
    label: "เสื้อผ้า",
  },
  {
    value: "เกม",
    label: "เกม",
  },
  {
    value: "ค่าเดินทาง",
    label: "ค่าเดินทาง",
  },
  {
    value: "ของใช้",
    label: "ของใช้",
  },
  {
    value: "ทั่วไป",
    label: "ทั่วไป",
  },
];

export default function CreditCard({ creditcard, isTab1 }: CreditCardProps) {
  const supabase = createClient();
  const [Credisel, setCredisel] = useState<any>([]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editedDataCredit, seteditedDataCredit] = useState<any>(null);
  const [cardAdd, setcardAdd] = useState<any>([]);
  const [showFields, setShowFields] = useState(false);

  const creditcardselect = async () => {
    let { data: CreditCard, error } = await supabase
      .from("CreditCard")
      .select("*")
      .like("card", `%${creditcard}%`);

    if (CreditCard) {
      console.log("DATA Credit Sel", creditcard);
      setCredisel(CreditCard);
    }

    if (!CreditCard || error) {
      console.log("ERRORCreditCard :", error);
    }
  };

  const showModal = (record: SetStateAction<null> | { id: number }) => {
    seteditedDataCredit(null);
    seteditedDataCredit(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    seteditedDataCredit(null);
    setIsModalOpen(false);
  };

  const AddCard = async () => {
    let { data: selectcard, error } = await supabase
      .from("selection")
      .select("creditcard")
      .not("creditcard", "is", null);

    if (selectcard) {
      setcardAdd(selectcard);
      const cardcreditname = selectcard.map(({ creditcard }) => ({
        value: creditcard,
        label: creditcard,
      }));
      setcardAdd(cardcreditname);
      console.log(cardcreditname);
    }

    if (!selectcard || error) {
      console.log("creditcard :", error);
    }
  };

  useEffect(() => {
    creditcardselect();
    AddCard();
  }, [creditcard, isTab1]);

  useEffect(() => {
    if (editedDataCredit) {
      form.setFieldsValue({
        id: editedDataCredit.id,
        list: editedDataCredit.list,
        price: editedDataCredit.price,
        card: editedDataCredit.card,
        date: dayjs(editedDataCredit.date),
        purchase_type: editedDataCredit.purchase_type,
        oncredit_month: editedDataCredit.oncredit_month,
        price_oncredit: editedDataCredit.price_oncredit,
        type: editedDataCredit.type,
        status: editedDataCredit.status,
      });
    }
  }, [editedDataCredit, form]);

  const handleUpdate = async () => {
    try {
      if (editedDataCredit) {
        const { date, ...EditCreditCost } = form.getFieldsValue();

        const datefor = dayjs(date).endOf("day");

        const EditJSONCredit = JSON.stringify({
          ...EditCreditCost,
          date: datefor,
        });
        console.log(EditJSONCredit);
        setSpinning(true);
        await UPDCredit(EditJSONCredit);

        handleCancel(); // หลังจากส่งข้อมูลเสร็จ ปิด Modal

        setTimeout(() => {
          creditcardselect();
          setSpinning(false);
        }, 1000);
        messageApi.success("Success Update!!");
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
      await DelCredit(id);

      setTimeout(() => {
        creditcardselect();
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
      await STATCREDIT(id, status);

      setTimeout(() => {
        creditcardselect();
        setSpinning(false);
      }, 1000);

      messageApi.success("Success Update Status");
    } catch (error) {
      console.log("ErrorStatus:", error);
      setSpinning(false);
      messageApi.error("Error UpdateStatus!!!");
    }
  };
  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-2">
          <div className="mb-0">
            <span className="text-lg font-medium ">Total</span>
            <Progress
              percent={30}
              status="active"
              format={(percent) => `${percent} Days Left`}
            />
          </div>

          <div className="mb-0">
            <span className="text-lg font-medium ">Success</span>
            <Progress
              percent={50}
              strokeColor={{ "0%": "#09C728", "100%": "#09C728" }}
            />
          </div>

          <Progress
            percent={70}
            strokeColor={{ "0%": "#FF0000", "100%": "#FF0000" }}
          />
        </Col>

        <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-2">
          <Cardantd bordered={true} className="drop-shadow-md" >
            <Progress
              percent={70}
              strokeColor={{ "0%": "#FF0000", "100%": "#FF0000" }}
            />
          </Cardantd>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-2">
          <Cardantd bordered={true} className="drop-shadow-lg">
            <Statistic
              title="Price"
              value="sd"
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix="THB"
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
          <Table
            dataSource={Credisel}
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
                title: "Date",
                dataIndex: "date",
                key: "date",
                render: (date) => {
                  const fomatsd = dayjs(date).format("DD/MM/YYYY");
                  return <span>{fomatsd}</span>;
                },
              },
              {
                title: "List",
                dataIndex: "list",
                key: "list",
              },
              {
                title: "Card",
                dataIndex: "card",
                key: "card",
              },
              {
                title: "Price",
                dataIndex: "price",
                key: "price",
                render: (price: number) => (
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(price)}
                  </span>
                ),
              },
              {
                title: "Purchase_type",
                dataIndex: "purchase_type",
                key: "purchase_type",
              },
              {
                title: "Oncredit_month",
                dataIndex: "oncredit_month",
                key: "oncredit_month",
                render: (oncredit_month: number) => (
                  <Statistic
                    value={oncredit_month}
                    precision={0}
                    valueStyle={{ color: "#000", fontSize: "14px" }}
                    suffix="month"
                  />
                ),
              },
              {
                title: "Price_oncredit",
                dataIndex: "price_oncredit",
                key: "price_oncredit",
                render: (price_oncredit: number) => (
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(price_oncredit)}
                  </span>
                ),
              },
              {
                title: "Type",
                dataIndex: "type",
                key: "type",
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
          open={isModalOpen}
          title={
            <div className="flex items-center space-x-1">
              <PlusCircleFilled className="mr-2 text-teal-600" />
              Add Credit Cost
            </div>
          }
          //onOk={handleOk}
          onCancel={handleCancel}
          footer={(_, { OkBtn, CancelBtn }) => (
            <>
              {contextHolder}
              <Button
                shape="round"
                icon={<CheckOutlined />}
                onClick={handleUpdate}
                className="ml-2"
              >
                Save
              </Button>
              <Tooltip title="Cancle">
                <Button
                  type="primary"
                  danger
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  shape="circle"
                  className="ml-2"
                ></Button>
              </Tooltip>
            </>
          )}
          style={{ maxWidth: "90vw", width: "100%" }}
        >
          <Form
            form={form}
            style={{ maxWidth: "100%" }}
            initialValues={{ status: false }}
            autoComplete="off"
            labelCol={{ span: 4 }}
          >
            {editedDataCredit && (
              <>
                <Form.Item label="ID" name="id" className="mb-4" hidden>
                  <p>{editedDataCredit?.id}</p>
                </Form.Item>
                <Form.Item label="List" name="list" className="mb-4">
                  <Input name="list" className="w-full" />
                </Form.Item>

                <Form.Item
                  label="Price"
                  name="price"
                  className="mb-4"
                  initialValue={0}
                >
                  <InputNumber
                    prefix="THB"
                    className="w-full"
                    name="price"
                    formatter={(value) => (value ? `${value}` : "0")}
                    parser={(value) => (value ? parseFloat(value) : 0)}
                  />
                </Form.Item>

                <Form.Item label="Card" name="card" className="mb-4">
                  <Select
                    showSearch
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      typeof option?.label === "string" &&
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    filterSort={(optionCrn1, optionCrn2) => {
                      const labelcrn1 =
                        typeof optionCrn1?.label === "string"
                          ? optionCrn1.label
                          : "";
                      const labelcrn2 =
                        typeof optionCrn2?.label === "string"
                          ? optionCrn2.label
                          : "";

                      return labelcrn1
                        .toLowerCase()
                        .localeCompare(labelcrn2.toLowerCase());
                    }}
                    options={cardAdd}
                  />
                </Form.Item>

                <Form.Item label="Date" name="date" className="mb-4">
                  <DatePicker
                    //onChange={onChange}
                    style={{ width: "100%" }}
                    name="date"
                  />
                </Form.Item>

                <Form.Item
                  label="TPurchase"
                  name="purchase_type"
                  className="mb-4"
                >
                  <Select
                    showSearch
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={purc_type}
                  />
                </Form.Item>

                <Form.Item label="OCDM" name="oncredit_month" className="mb-4">
                  <Input name="oncredit_month" className="w-full" />
                </Form.Item>

                <Form.Item
                  label="Price credit"
                  name="price_oncredit"
                  className="mb-4"
                  initialValue={0}
                >
                  <InputNumber
                    prefix="THB"
                    className="w-full"
                    name="price_oncredit"
                    formatter={(value) => (value ? `${value}` : "0")}
                    parser={(value) => (value ? parseFloat(value) : 0)}
                  />
                </Form.Item>

                <Form.Item label="Type" name="type" className="mb-4">
                  <Select
                    showSearch
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={type}
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

export function AddCreditCost() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm(); // เพิ่ม form instance
  const [messageApi, contextHolder] = message.useMessage();
  const [cardAdd, setcardAdd] = useState<any>([]);
  const [showFields, setShowFields] = useState(false);
  const [spinning, setSpinning] = useState<boolean>(false);

  const supabase = createClient();

  const AddCard = async () => {
    let { data: selectcard, error } = await supabase
      .from("selection")
      .select("creditcard")
      .not("creditcard", "is", null);

    if (selectcard) {
      setcardAdd(selectcard);
      const cardcreditname = selectcard.map(({ creditcard }) => ({
        value: creditcard,
        label: creditcard,
      }));
      setcardAdd(cardcreditname);
      console.log(cardcreditname);
    }

    if (!selectcard || error) {
      console.log("creditcard :", error);
    }
  };

  /*
  const purc_type = [
    {
      value: "เงินสด",
      label: "เงินสด",
    },
    {
      value: "ผ่อน",
      label: "ผ่อน",
    },
  ];

  const type = [
    {
      value: "น้ำมัน",
      label: "น้ำมัน",
    },
    {
      value: "น้ำ",
      label: "น้ำ",
    },
    {
      value: "อาหาร",
      label: "อาหาร",
    },
    {
      value: "เสื้อผ้า",
      label: "เสื้อผ้า",
    },
    {
      value: "เกม",
      label: "เกม",
    },
    {
      value: "ค่าเดินทาง",
      label: "ค่าเดินทาง",
    },
    {
      value: "ของใช้",
      label: "ของใช้",
    },
    {
      value: "ทั่วไป",
      label: "ทั่วไป",
    },
  ];
  */

  useEffect(() => {
    AddCard();
  }, []);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const handlePurchaseType = (value: string) => {
    setShowFields(value === "ผ่อน");

    // Clear values when hiding the fields
    if (!showFields) {
      form.setFieldsValue({
        oncredit_month: "0",
        price_oncredit: "0",
      });
    }
  };

  const handleOk = async () => {
    try {
      const DataADC = form.getFieldsValue();
      const DataADCJSON = JSON.stringify(DataADC);

      console.log(DataADCJSON);
      setSpinning(true);
      await CreditCostAdd(DataADCJSON);

      handleCancel();

      messageApi.success("Success Insert Credit Cost!!");

      setTimeout(() => {
        window.location.reload();
        setSpinning(false);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setSpinning(false);
      messageApi.error("Error Insert Credit Cost!!!");
    }
  };

  return (
    <div>
      <div className="flex justify-end mr-2">
        <Tooltip title="Add">
          <Button
            size="middle"
            icon={<PlusOutlined />}
            onClick={showModal}
            className="buttonYTPm1"
          />
        </Tooltip>
      </div>

      <Modal
        open={open}
        title={
          <div className="flex items-center space-x-1">
            <PlusCircleFilled className="mr-2 text-teal-600" />
            Add Credit Cost
          </div>
        }
        //onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {contextHolder}
            <Button
              shape="round"
              icon={<CheckOutlined />}
              onClick={handleOk}
              className="ml-2"
            >
              Save
            </Button>
            <Tooltip title="Cancle">
              <Button
                type="primary"
                danger
                icon={<CloseOutlined />}
                onClick={handleCancel}
                shape="circle"
                className="ml-2"
              ></Button>
            </Tooltip>
          </>
        )}
        style={{ maxWidth: "90vw", width: "100%" }}
      >
        <Form
          form={form}
          style={{ maxWidth: "100%" }}
          initialValues={{ status: false }}
          autoComplete="off"
          labelCol={{ span: 4 }}
        >
          <Form.Item
            label="List"
            name="list"
            rules={[{ required: true, message: "Please input your List!" }]}
            className="mb-4"
          >
            <Input name="list" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            className="mb-4"
            initialValue={0}
          >
            <InputNumber
              prefix="THB"
              className="w-full"
              name="price"
              formatter={(value) => (value ? `${value}` : "0")}
              parser={(value) => (value ? parseFloat(value) : 0)}
            />
          </Form.Item>

          <Form.Item
            label="Card"
            name="card"
            rules={[{ required: true, message: "Please input your Card!" }]}
            className="mb-4"
          >
            <Select
              showSearch
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                typeof option?.label === "string" &&
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              filterSort={(optionCrn1, optionCrn2) => {
                const labelcrn1 =
                  typeof optionCrn1?.label === "string" ? optionCrn1.label : "";
                const labelcrn2 =
                  typeof optionCrn2?.label === "string" ? optionCrn2.label : "";

                return labelcrn1
                  .toLowerCase()
                  .localeCompare(labelcrn2.toLowerCase());
              }}
              options={cardAdd}
            />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please input Date!" }]}
            className="mb-4"
          >
            <DatePicker
              //onChange={onChange}
              style={{ width: "100%" }}
              name="date"
            />
          </Form.Item>

          <Form.Item
            label="TPurchase"
            name="purchase_type"
            className="mb-4"
            rules={[
              { required: true, message: "Please input your purchase_Type!" },
            ]}
          >
            <Select
              showSearch
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={purc_type}
              onChange={handlePurchaseType}
            />
          </Form.Item>

          <Form.Item
            label="OCDM"
            name="oncredit_month"
            className="mb-4"
            style={{ display: showFields ? "block" : "none" }}
          >
            <Input name="oncredit_month" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Price credit"
            name="price_oncredit"
            className="mb-4"
            initialValue={0}
            style={{ display: showFields ? "block" : "none" }}
          >
            <InputNumber
              prefix="THB"
              className="w-full"
              name="price_oncredit"
              formatter={(value) => (value ? `${value}` : "0")}
              parser={(value) => (value ? parseFloat(value) : 0)}
            />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            className="mb-4"
            rules={[{ required: true, message: "Please input your Type!" }]}
          >
            <Select
              showSearch
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={type}
            />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              className="bg-red-500"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
