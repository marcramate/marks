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
  Descriptions,
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
import {
  CreditCostAdd,
  UPDCredit,
  DelCredit,
  STATCREDIT,
  UpPerMonthCredit,
  DelAllCredit,
} from "@/app/actions";

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
  const [Salycr, setSalycr] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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

  const SaralyCr = async () => {
    let { data: selection, error } = await supabase
      .from("selection")
      .select("creditcard,SalaryCredit")
      .eq("creditcard", creditcard)
      .not("creditcard", "is", null);

    if (selection) {
      console.log("DATA SaralyCr", selection);
      setSalycr(selection);
    }

    if (!selection || error) {
      console.log("ERRORSaralyCr :", error);
    }
  };

  useEffect(() => {
    creditcardselect();
    AddCard();
    SaralyCr();
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
        paycredit_month: editedDataCredit.paycredit_month,
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

  const handleUpPayMonth = async (record: any) => {
    try {
      const { id, paycredit_month, oncredit_month, status, purchase_type } =
        record;

      console.log(
        "ID:",
        id,
        "Pcm:",
        paycredit_month,
        "ocm:",
        oncredit_month,
        "status:",
        status,
        "purchase_type",
        purchase_type
      );

      setSpinning(true);
      await UpPerMonthCredit(
        id,
        paycredit_month,
        oncredit_month,
        status,
        purchase_type
      );
      setTimeout(() => {
        creditcardselect();
        setSpinning(false);
      }, 1000);
    } catch (error) {
      console.log("ErrorStatus:", error);
      setSpinning(false);
      messageApi.error("Error UpdateMonthPay!!!");
    }
  };

  const Credituse = Credisel.reduce(
    (accumulator: any, currentTotalCredit: { price: any }) => {
      return accumulator + currentTotalCredit.price;
    },
    0
  );

  const TotalCredit = Credisel.filter(
    (CreditCard: { purchase_type: string }) =>
      CreditCard.purchase_type && CreditCard.purchase_type === "เงินสด"
  ).reduce((accumulator: any, currentTotalCredit: { price: any }) => {
    return accumulator + currentTotalCredit.price;
  }, 0);

  const PayCost = Credisel.filter(
    (CreditCard: { purchase_type: string; status: boolean }) =>
      CreditCard.purchase_type === "เงินสด" && CreditCard.status
  ).reduce(
    (accumulator: number, currentPayCost: { price: number }) =>
      accumulator + currentPayCost.price,
    0
  );

  const WaitCost = Credisel.filter(
    (CreditCard: { purchase_type: string; status: boolean }) =>
      CreditCard.purchase_type === "เงินสด" && !CreditCard.status
  ).reduce(
    (accumulator: number, currentPayCost: { price: number }) =>
      accumulator + currentPayCost.price,
    0
  );

  const TotalinCredit = Credisel.filter(
    (CreditCard: { purchase_type: string }) =>
      CreditCard.purchase_type && CreditCard.purchase_type === "ผ่อน"
  ).reduce((accumulator: any, currentTotalinCredit: { price: any }) => {
    return accumulator + currentTotalinCredit.price;
  }, 0);

  const PayinCredit = Credisel.filter(
    (CreditCard: { purchase_type: string }) =>
      CreditCard.purchase_type === "ผ่อน"
  ).reduce(
    (
      accumulator: number,
      currentPayinCredit: { price_oncredit: number; paycredit_month: number }
    ) =>
      accumulator +
      currentPayinCredit.price_oncredit * currentPayinCredit.paycredit_month,
    0
  );

  const WaitinCredit = Credisel.filter(
    (CreditCard: { purchase_type: string; status: boolean }) =>
      CreditCard.purchase_type === "ผ่อน" && !CreditCard.status
  ).reduce((accumulator: any, currentTotalinCredit: { price: number }) => {
    return accumulator + currentTotalinCredit.price - PayinCredit;
  }, 0);

  interface CreditData {
    id: number;
    list: string;
    c_price: number;
    card: string;
    date: string;
    purchase_type: string;
    oncredit_month: number;
    paycredit_month: number;
    price_oncredit: string;
    status: boolean;
    type: string;
  }

  const handleCreditcardExport = async () => {
    try {
      let { data: CreditCard, error } = await supabase
        .from("CreditCard")
        .select("*")
        .eq("status", true)
        .like("card", `%${creditcard}%`);

      setSpinning(true);

      if (!CreditCard || error || CreditCard.length === 0) {
        console.log("CreditCardExport:", error);
        messageApi.error("No data available.");
        setSpinning(false);
        return;
      }

      exportToExcel(CreditCard, "CreditCard", "Credit_Data_");
      setSpinning(false);
      messageApi.success("Downloading Excel file...");
    } catch (error) {
      setSpinning(false);
      console.error("Error fetching data:", error);
      messageApi.error("Error fetching data.");
    }
  };
  function exportToExcel(
    data: CreditData[],
    sheetName: string,
    fileName: string
  ) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const newdate = new Date().toISOString().split("T")[0];
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}_${newdate}.xlsx`);
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleDelAll = async (ids: any[]) => {
    try {
      const IDSid = ids.map((item) => item.replace("ID: ", ""));

      console.log("ids:", ids);
      console.log("cle:", IDSid);
      setSpinning(true);
      await DelAllCredit(ids);

      setTimeout(() => {
        creditcardselect();
        setSpinning(false);
      }, 1000);

      messageApi.success("Success Delete All !!");
    } catch (error) {
      console.error("ErrorDelAll:", error);
      setSpinning(false);
      messageApi.error("Error Delete All!!!");
    }
  };

  const { confirm } = Modal;
  const showDeleteConfirmation = () => {
    if (selectedRowKeys.length === 0) {
      messageApi.error("Please select at least one row to delete.");
      return;
    }
    confirm({
      title: "Are you sure you want to Delete all?",
      content: (
        <div>
          <ul>
            <li className="mb-2">
              <h1 className="font-medium">
                <Space>
                  <Badge status="success" text="Today :" />
                  {dayjs().format("YYYY-MM-DD")}
                </Space>
              </h1>
            </li>
            {selectedRowKeys.map((key, index) => {
              const DataCredit = Credisel.find((item: any) => item.id === key);

              return (
                <li className="text-red-500" key={index}>
                  <Tag color="error" className="mb-1">
                    ID: {key}, Card: {DataCredit?.card}, Price:
                    {DataCredit?.price}, Type:{DataCredit?.purchase_type}
                  </Tag>
                </li>
              );
            })}
          </ul>
        </div>
      ),
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      style: { maxWidth: "90vw", width: "100%" },
      onOk: () => handleDelAll(selectedRowKeys.map((key) => key.toString())),
      onCancel() {
        {
          handleCancel;
        }
      },
    });
  };
  return (
    <div>
      <div>
        <Descriptions>
          <Descriptions.Item label="Credit limit">
            {Salycr.map((item: any) => (
              <span
                key={item.creditcard}
                className="font-normal text-green-600"
              >
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(item.SalaryCredit)}
              </span>
            ))}
          </Descriptions.Item>

          <Descriptions.Item label="Credit Use">
            <span className="font-normal text-red-500">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "THB",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Credituse)}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </div>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-2">
          <Cardantd bordered={true} className="drop-shadow-md" title="Cash">
            <div>
              <span className="text-base font-medium ">
                Total{" - "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(TotalCredit))}
              </span>
              {Salycr.map((item: any) => (
                <Progress
                  key={item.creditcard}
                  percent={
                    item.SalaryCredit
                      ? (TotalCredit / item.SalaryCredit) * 100
                      : 0
                  }
                  showInfo={false}
                  status="active"
                />
              ))}
            </div>

            <div>
              <span className="text-base font-medium ">
                Pay{" - "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(PayCost))}
              </span>
              {Salycr.map((item: any) => (
                <Progress
                  key={item.creditcard}
                  percent={
                    item.SalaryCredit ? (PayCost / item.SalaryCredit) * 100 : 0
                  }
                  showInfo={false}
                  strokeColor={{ "0%": "#09C728", "100%": "#09C728" }}
                />
              ))}
            </div>

            <div>
              <span className="text-base font-medium ">
                Wait{" - "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(WaitCost))}
              </span>
              {Salycr.map((item: any) => (
                <Progress
                  key={item.creditcard}
                  percent={
                    item.SalaryCredit ? (WaitCost / item.SalaryCredit) * 100 : 0
                  }
                  showInfo={false}
                  strokeColor={{ "0%": "#FF0000", "100%": "#FF0000" }}
                />
              ))}
            </div>
          </Cardantd>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-2">
          <Cardantd
            bordered={true}
            className="drop-shadow-lg"
            title="Installments"
          >
            <div>
              <span className="text-base font-medium ">
                Total{" - "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(TotalinCredit))}
              </span>
              {Salycr.map((item: any) => (
                <Progress
                  key={item.creditcard}
                  percent={
                    item.SalaryCredit
                      ? (TotalinCredit / item.SalaryCredit) * 100
                      : 0
                  }
                  showInfo={false}
                  status="active"
                />
              ))}
            </div>

            <div>
              <span className="text-base font-medium ">
                Pay{" - "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(PayinCredit))}
              </span>
              {Salycr.map((item: any) => (
                <Progress
                  key={item.creditcard}
                  percent={
                    TotalinCredit ? (PayinCredit / TotalinCredit) * 100 : 0
                  }
                  showInfo={false}
                  strokeColor={{ "0%": "#09C728", "100%": "#09C728" }}
                />
              ))}
            </div>

            <div>
              <span className="text-base font-medium ">
                Wait{" - "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(WaitinCredit))}
              </span>
              {Salycr.map((item: any) => (
                <Progress
                  key={item.creditcard}
                  percent={
                    TotalinCredit ? (WaitinCredit / TotalinCredit) * 100 : 0
                  }
                  showInfo={false}
                  strokeColor={{ "0%": "#FF0000", "100%": "#FF0000" }}
                />
              ))}
            </div>
          </Cardantd>
        </Col>
      </Row>
      <div className="mb-4"></div>

      <Spin
        spinning={spinning}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4">
          <Card decoration="left" decorationColor="indigo" key="unique-key">
            <div className="flex justify-end mb-2">
              <Button className="mr-2" danger onClick={showDeleteConfirmation}>
                Delete Select
              </Button>
              <Button
                className="mr-2 buttonExport"
                icon={<DownloadOutlined />}
                onClick={handleCreditcardExport}
              >
                Dowlode Excel
              </Button>
            </div>
            <div className="table-container" style={{ overflowX: "auto" }}>
              <Table
                rowKey={(record) => record.id}
                dataSource={Credisel}
                rowSelection={rowSelection}
                columns={[
                  {
                    title: "ID",
                    dataIndex: "id",
                    key: "id",
                    sorter: (id1: { id: number }, id2: { id: number }) =>
                      id1.id - id2.id,
                    defaultSortOrder: "ascend", // เรียงลำดับจากน้อยไปมาก
                    responsive: ["lg"],
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
                    title: "Pay_Type",
                    dataIndex: "purchase_type",
                    key: "purchase_type",
                  },
                  {
                    title: "Installment",
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
                    title: "Pay_month",
                    dataIndex: "paycredit_month",
                    key: "paycredit_month",
                    render: (paycredit_month: number) => (
                      <Statistic
                        value={paycredit_month}
                        precision={0}
                        valueStyle={{ color: "#000", fontSize: "14px" }}
                        suffix="month"
                      />
                    ),
                  },
                  {
                    title: "Price_month",
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
                        text={status ? "จ่ายแล้ว" : "ยังไม่จ่าย"}
                      />
                    ),
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
                  {
                    title: "All Update",
                    key: "action2",
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
                            Status
                          </Button>
                        </Tooltip>
                        <Tooltip title="UpdateMonthPay">
                          <Button
                            className="buttonUpStatus"
                            shape="round"
                            icon={<PlusOutlined className="text-green-700" />}
                            size={"small"}
                            onClick={() => handleUpPayMonth(record)}
                          >
                            MonthPay
                          </Button>
                        </Tooltip>
                      </Space>
                    ),
                  },
                ]}
                scroll={{ x: "max-content", y: "max-content" }}
              />
            </div>
          </Card>
        </div>
        <Modal
          open={isModalOpen}
          title={
            <div className="flex items-center space-x-1">
              <PlusCircleFilled className="mr-2 text-teal-600" />
              Edit Credit Cost
            </div>
          }
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
                  <InputNumber
                    name="oncredit_month"
                    className="w-full"
                    formatter={(value) => (value ? `${value}` : "0")}
                    parser={(value) => (value ? parseFloat(value) : 0)}
                  />
                </Form.Item>

                <Form.Item
                  label="PreCm"
                  name="paycredit_month"
                  className="mb-4"
                >
                  <InputNumber
                    name="paycredit_month"
                    className="w-full"
                    formatter={(value) => (value ? `${value}` : "0")}
                    parser={(value) => (value ? parseFloat(value) : 0)}
                  />
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
        paycredit_month: "0",
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
            label="PerCm"
            name="paycredit_month"
            className="mb-4"
            style={{ display: showFields ? "block" : "none" }}
          >
            <InputNumber
              name="paycredit_month"
              className="w-full"
              formatter={(value) => (value ? `${value}` : "0")}
              parser={(value) => (value ? parseFloat(value) : 0)}
            />
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
