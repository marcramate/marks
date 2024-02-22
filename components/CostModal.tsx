"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Tooltip,
  Form,
  Input,
  Switch,
  Select,
  InputNumber,
  message,
  DatePicker,
  DatePickerProps,
  Spin,
} from "antd";
import {
  PlusOutlined,
  PlusCircleFilled,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { createClient } from "@/utils/supabase/client";
import { PMEX, UPDSTALPM, GMEX, CartagIn, MilesIn } from "@/app/actions";
import dayjs from "dayjs";

interface MonthlyexpensesProps {
  company: string;
  isTab1: boolean;
}

export default function MDexpesescost({
  company,
  isTab1,
}: MonthlyexpensesProps) {
  const [open, setOpen] = useState(false);
  const [Comselec, setComselec] = useState<any>([]);
  const [SelcCom, setSelccom] = useState<any>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm(); // เพิ่ม form instance
  const supabase = createClient();
  const [spinning, setSpinning] = useState<boolean>(false);

  const fetchSelcom = async () => {
    let { data: selection, error } = await supabase
      .from("selection")
      .select("company")
      .like("company ", `%${company}%`);

    if (selection) {
      setComselec(selection);
      const seleccom = selection.map(({ company }) => ({
        value: company,
        label: company,
      }));
      setSelccom(seleccom);
      console.log(seleccom);
    }

    if (!selection || error) {
      console.log("SELCompany :", error);
    }
  };

  useEffect(() => {
    fetchSelcom();
  }, [company, isTab1]);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      setSpinning(true);
      const DataPm = form.getFieldsValue();
      const DataPmJSON = JSON.stringify(DataPm);

      console.log(DataPmJSON);
      await PMEX(DataPmJSON);

      handleCancel();

      messageApi.success("Success Insert Expenses!!");

      setTimeout(() => {
        setSpinning(false);
      }, 5000);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      messageApi.error("Error Insert Expenses!!!");
    }
  };

  const handleCancel = () => {
    form.resetFields(); // ล้างข้อมูลฟอร์มเมื่อ Modal ถูกปิด
    setOpen(false);
  };

  const handleUpdStatus = async () => {
    try {
      setSpinning(true);

      await UPDSTALPM();
      messageApi.success("Success Update All Status ==> False");

      setTimeout(() => {
        setSpinning(false);
      }, 5000);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      messageApi.error("Error Update Status");
    }
  };

  return (
    <>
      <div className="flex justify-end mr-2">
        <Spin spinning={spinning} fullscreen />
        <Button className="mr-2" danger onClick={handleUpdStatus}>
          Update Status False
        </Button>

        <Tooltip title="Add">
          <Button
            size="middle"
            icon={<PlusOutlined />}
            onClick={showModal}
            className="buttonYTPm1"
          />
        </Tooltip>
      </div>
      <div className="mb-4"></div>
      <Modal
        open={open}
        title={
          <div className="flex items-center space-x-1">
            <PlusCircleFilled className="mr-2 text-teal-600" />
            Add Expenses
          </div>
        }
        onCancel={handleCancel}
        footer={[
          <div>
            {contextHolder}
            <Button
              shape="round"
              icon={<CheckOutlined />}
              onClick={handleOk}
              className="ml-2"
            >
              Save
            </Button>
            <Spin spinning={spinning} fullscreen />
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
          </div>,
        ]}
      >
        <Form
          form={form}
          style={{ maxWidth: 450 }}
          initialValues={{ status: false }}
          autoComplete="off"
          labelCol={{ span: 4 }}
        >
          <Form.Item
            label="List"
            name="text"
            rules={[{ required: true, message: "Please input your Name!" }]}
            className="mb-4"
          >
            <Input name="text" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Company"
            name="company"
            rules={[{ required: true, message: "Please Select Your Company!" }]}
            className="mb-4"
          >
            <Select
              placeholder="Search to Select"
              optionFilterProp="children"
              options={SelcCom}
            />
          </Form.Item>

          <Form.Item
            label="Cost"
            name="cost"
            className="mb-4"
            initialValue={0}
            rules={[
              {
                required: true,
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
        </Form>
      </Modal>
    </>
  );
}

export function Gmmodal() {
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm(); // เพิ่ม form instance

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    form.resetFields(); // ล้างข้อมูลฟอร์มเมื่อ Modal ถูกปิด
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const DataGme = form.getFieldsValue();
      const DataGmeJson = JSON.stringify(DataGme);

      console.log("Data:", DataGmeJson);
      await GMEX(DataGmeJson);
      messageApi.success("Success Insert GM!!");

      handleCancel();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error GM:", error);
      messageApi.error("Error Insert GM!!!");
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

      <div className="mb-2" />

      <Modal
        open={open}
        title={
          <div className="flex items-center space-x-1">
            <PlusCircleFilled className="mr-2 text-teal-600" />
            Add Expenses GraceMarc
          </div>
        }
        onCancel={handleCancel}
        footer={[
          <div>
            {contextHolder}
            <Button
              shape="round"
              icon={<CheckOutlined />}
              onClick={handleSave}
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
          </div>,
        ]}
      >
        <Form
          form={form}
          style={{ maxWidth: 450 }}
          initialValues={{ status: false, company: "GraceMarc" }}
          autoComplete="off"
          labelCol={{ span: 4 }}
        >
          <Form.Item
            label="List"
            name="text"
            rules={[{ required: true, message: "Please input your Name!" }]}
            className="mb-4"
          >
            <Input name="text" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Choice"
            name="company"
            rules={[{ required: true, message: "Please Select Your Company!" }]}
            className="mb-4"
          >
            <Select
              placeholder="Search to Select"
              optionFilterProp="children"
              options={[{ value: "GraceMarc", label: "GraceMarc" }]}
            />
          </Form.Item>

          <Form.Item
            label="Cost"
            name="cost"
            className="mb-4"
            initialValue={0}
            rules={[
              {
                required: true,
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
        </Form>
      </Modal>
    </div>
  );
}

export function Cartagmodal() {
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [Scta, setScta] = useState<any>([]);
  const [Carname, setcarname] = useState<any>([]);
  const [form] = Form.useForm(); // เพิ่ม form instance
  const supabase = createClient();

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
    tagcar();
    carname();
  }, []);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    form.resetFields(); // ล้างข้อมูลฟอร์มเมื่อ Modal ถูกปิด
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const Datacartag = form.getFieldsValue();
      const DatacartagJson = JSON.stringify(Datacartag);

      console.log("Datacartag:", DatacartagJson);
      await CartagIn(DatacartagJson);
      messageApi.success("Success Insert Cartag!!");

      handleCancel();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error Cartag:", error);
      messageApi.error("Error Insert Cartag!!!");
    }
  };

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const ondateend = (date: any, dateString: string) => {
    const startDate: dayjs.Dayjs = dayjs(dateString).endOf("day");

    const newDateend = dayjs(dateString).endOf("day").add(1, "year");
    form.setFieldsValue({
      c_startdate: startDate,
      c_enddate: newDateend,
    });
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

      <div className="mb-2" />

      <Modal
        open={open}
        title={
          <div className="flex items-center space-x-1">
            <PlusCircleFilled className="mr-2 text-teal-600" />
            Add CarTag
          </div>
        }
        onCancel={handleCancel}
        footer={[
          <div>
            {contextHolder}
            <Button
              shape="round"
              icon={<CheckOutlined />}
              onClick={handleSave}
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
          </div>,
        ]}
      >
        <Form
          form={form}
          style={{ maxWidth: 450 }}
          initialValues={{
            c_startdate: dayjs(),
            c_enddate: dayjs().add(1, "year"),
          }}
          autoComplete="off"
          labelCol={{ span: 4 }}
        >
          <Form.Item
            label="Car"
            name="c_name"
            rules={[{ required: true, message: "Please input your Car!" }]}
            className="mb-4"
          >
            <Select
              placeholder="Search to Select"
              optionFilterProp="children"
              options={Carname}
            />
          </Form.Item>

          <Form.Item
            label="CarTag"
            name="c_tag"
            rules={[{ required: true, message: "Please Select Your CarTag!" }]}
            className="mb-4"
          >
            <Select
              placeholder="Search to Select"
              optionFilterProp="children"
              options={Scta}
            />
          </Form.Item>

          <Form.Item
            label="Price"
            name="c_price"
            className="mb-4"
            initialValue={0}
            rules={[
              {
                required: true,
                type: "number",
                message: "Please input a valid number",
              },
            ]}
          >
            <InputNumber
              prefix="THB"
              className="w-full"
              name="c_price"
              formatter={(value) => (value ? `${value}` : "0")}
              parser={(value) => (value ? parseFloat(value) : 0)}
            />
          </Form.Item>

          <Form.Item
            label="Date"
            name="c_startdate"
            rules={[{ required: true, message: "Please input Date!" }]}
            className="mb-4"
          >
            <DatePicker
              onChange={ondateend}
              style={{ width: "100%" }}
              name="c_startdate"
            />
          </Form.Item>

          <Form.Item
            label="DateEnd"
            name="c_enddate"
            rules={[{ required: true, message: "Please input Date!" }]}
            className="mb-4"
          >
            <DatePicker
              onChange={onChange}
              style={{ width: "100%" }}
              name="c_enddate"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export function MilesAdd() {
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [Scta, setScta] = useState<any>([]);
  const [Carname, setcarname] = useState<any>([]);
  const [form] = Form.useForm(); // เพิ่ม form instance
  const supabase = createClient();

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

  useEffect(() => {
    carname();
  }, []);

  const oilstation = [
    {
      value: "PTT",
      label: "PTT (ปตท.)",
    },
    {
      value: "Bangchak",
      label: "Bangchak (บางจาก)",
    },
    {
      value: "Caltex",
      label: "Caltex (คาลเท็กซ์)",
    },
    {
      value: "Susco",
      label: "Susco (ซัสโก้)",
    },
    {
      value: "PT",
      label: "PT (พีที)",
    },
    {
      value: "Shell",
      label: "Shell (เชลล์)",
    },
  ];

  const oiltype = [
    {
      value: "Gasohol 95",
      label: "E10 (แก๊สโซฮอล์ 95)",
    },
    {
      value: "Gasohol 91",
      label: "E10 (แก๊สโซฮอล์ 91)",
    },
    {
      value: "Gasohol E20",
      label: "E20 (แก๊สโซฮอล์ E20)",
    },
    {
      value: "Gasohol E85",
      label: "E85 (แก๊สโซฮอล์ E85)",
    },
    {
      value: "Gasoline 95",
      label: "E95 (เบนซิน 95)",
    },
    {
      value: "Diesel B7",
      label: "B7 (ดีเซล B7)",
    },
    {
      value: "Diesel B10",
      label: "B10 (ดีเซล B10)",
    },
    {
      value: "Diesel B20",
      label: "B20 (ดีเซล B20)",
    },
  ];

  const Gasohol = oiltype
    .filter(
      (type) =>
        type.value.includes("Gasohol") || type.value.includes("Gasoline")
    )
    .map((type) => ({
      label: type.label,
      value: type.value,
    }));

  const Diesel = oiltype
    .filter((type) => type.value.includes("Diesel"))
    .map((type) => ({
      label: type.label,
      value: type.value,
    }));

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    form.resetFields(); // ล้างข้อมูลฟอร์มเมื่อ Modal ถูกปิด
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const Datamiles = form.getFieldsValue();
      const DatamilesJson = JSON.stringify(Datamiles);

      console.log("DataMiles:", DatamilesJson);
      await MilesIn(DatamilesJson);
      messageApi.success("Success Insert Miles!!");

      handleCancel();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error Miles:", error);
      messageApi.error("Error Insert Miles!!!");
    }
  };

  const onDate: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <>
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

      <div className="mb-2" />
      <Modal
        open={open}
        title={
          <div className="flex items-center space-x-1">
            <PlusCircleFilled className="mr-2 text-teal-600" />
            Add MilesOil
          </div>
        }
        onCancel={handleCancel}
        footer={[
          <div>
            {contextHolder}
            <Button
              shape="round"
              icon={<CheckOutlined />}
              onClick={handleSave}
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
          </div>,
        ]}
        className="max-w-full"
      >
        <Form
          form={form}
          style={{ maxWidth: 450 }}
          autoComplete="off"
          labelCol={{ span: 4 }}
        >
          <Form.Item
            label="Car"
            name="c_name"
            rules={[{ required: true, message: "Please input your Car!" }]}
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
              options={Carname}
            />
          </Form.Item>

          <Form.Item
            label="Price"
            name="c_price"
            className="mb-4"
            initialValue={0}
            rules={[
              {
                required: true,
                type: "number",
                message: "Please input a valid number",
              },
            ]}
          >
            <InputNumber
              prefix="THB"
              className="w-full"
              name="c_price"
              formatter={(value) => (value ? `${value}` : "0")}
              parser={(value) => (value ? parseFloat(value) : 0)}
            />
          </Form.Item>

          <Form.Item label="OilStation" name="c_oilstation" className="mb-4">
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
              options={oilstation}
            />
          </Form.Item>

          <Form.Item label="OilType" name="c_oiltype" className="mb-4">
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
              options={[
                {
                  label: "Gasohol",
                  options: Gasohol,
                },
                {
                  label: "Diesel",
                  options: Diesel,
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="OilPrice"
            name="c_oilprice"
            className="mb-4"
            initialValue={0}
          >
            <InputNumber
              prefix="THB"
              className="w-full"
              name="c_oilprice"
              formatter={(value) => (value ? `${value}` : "0")}
              parser={(value) => (value ? parseFloat(value) : 0)}
            />
          </Form.Item>

          <Form.Item
            label="OilLitre"
            name="c_liter"
            className="mb-4"
            initialValue={0}
          >
            <InputNumber
              prefix="L"
              className="w-full"
              name="c_liter"
              formatter={(value) => (value ? `${value}` : "0")}
              parser={(value) => (value ? parseFloat(value) : 0)}
            />
          </Form.Item>

          <Form.Item
            label="Miles"
            name="c_miles"
            className="mb-4"
            initialValue={0}
          >
            <InputNumber
              prefix="Km"
              className="w-full"
              name="c_miles"
              formatter={(value) => (value ? `${value}` : "0")}
              parser={(value) => (value ? parseFloat(value) : 0)}
            />
          </Form.Item>

          <Form.Item
            label="Date"
            name="c_startdate"
            rules={[{ required: true, message: "Please input Date!" }]}
            className="mb-4"
          >
            <DatePicker
              onChange={onDate}
              style={{ width: "100%" }}
              name="c_startdate"
            />
          </Form.Item>

          <Form.Item label="DateEnd" name="c_enddate" className="mb-4">
            <DatePicker
              onChange={onDate}
              style={{ width: "100%" }}
              name="c_enddate"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
