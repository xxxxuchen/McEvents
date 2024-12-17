/**
 * Created by Barry Chen
 * 260952566
 */
import { DatePicker, Form, Input, InputNumber, TimePicker, Select } from "antd";

import dayjs from "dayjs";
import ImageUploader from "./ImageUploader";
import { useState } from "react";

const { TextArea } = Input;

const emptyFormValues = {
  title: "",
  venue: "",
  price: "",
  organization: "",
  holdingDate: "",
  description: "",
  image: "",
};

/**
 * PublishEventForm Component
 *
 * This component renders a form for publishing or updating an event. It includes fields for event details such as title, venue, price, organization, holding date, holding time, description, and image upload.
 *
 * Props:
 * - event (object): The event data to pre-fill the form fields when updating an existing event. Default is null.
 * - onSubmit (function): The callback function to handle form submission. It receives the form values as an argument.
 * - isSubmitting (boolean): A flag to indicate if the form is in the process of being submitted. Default is false.
 * - className (string): Additional CSS class names to apply to the form. Default is an empty string.
 *
 *
 */

export default function PublishEventForm({
  event,
  onSubmit,
  isSubmitting,
  className,
}) {
  let initialFormValues = emptyFormValues;
  if (event) {
    initialFormValues = {
      title: event.title || "",
      venue: event.venue || "",
      price: event.price || "",
      organization: event.organization || "",
      holdingDate: dayjs(event.holdingDate) || "",
      description: event.description || "",
      image: event.image || "",
    };
  }
  const [showImage, setShowImage] = useState(true);
  const [form] = Form.useForm();

  const handleImageUpload = (imgUrl) => {
    form.setFieldsValue({ image: imgUrl });
  };

  const onFinish = () => {
    const values = form.getFieldsValue();
    if (!values.image) values.image = event?.image || "";
    values.holdingDate = new Date(values.holdingDate).toISOString();
    form.setFieldsValue(emptyFormValues);
    onSubmit(values);
  };

  const handleReset = () => {
    setShowImage(true);
    form.resetFields();
  };

  const handleClear = () => {
    setShowImage(false);
    form.setFieldsValue(emptyFormValues);
  };

  return (
    <>
      <Form
        className={className}
        form={form}
        onFinish={onFinish}
        layout="horizontal"
        style={{
          maxWidth: 600,
        }}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
        initialValues={initialFormValues}
      >
        <Form.Item
          label="Event Name"
          name="title"
          rules={[{ required: true, message: "Please input event name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Venue"
          name="venue"
          rules={[{ required: true, message: "Please input venue!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please input price!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Organization"
          name="organization"
          rules={[{ required: true, message: "Please select organization!" }]}
        >
          <Select>
            <Select.Option value="personal">Personal</Select.Option>
            <Select.Option value="club">Club</Select.Option>
            <Select.Option value="department">Department</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Holding Date"
          name="holdingDate"
          rules={[{ required: true, message: "Please input holding date!" }]}
        >
          <DatePicker showTime={true}/>
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input description!" }]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          valuePropName="fileList"
          initialValue={initialFormValues.image}
          // rules={[{ required: true, message: "Please input image!" }]}
        >
          <ImageUploader
            onImageUpload={handleImageUpload}
            showImage={showImage}
            initialImage={initialFormValues.image}
          />
        </Form.Item>
        <Form.Item label={null} className="edit-form-buttons">
          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          {event && (
            <button
              className="btn-secondary"
              type="button"
              onClick={handleReset}
            >
              Reset
            </button>
          )}
          <button className="btn-secondary" type="button" onClick={handleClear}>
            Clear
          </button>
        </Form.Item>
      </Form>
    </>
  );
}
