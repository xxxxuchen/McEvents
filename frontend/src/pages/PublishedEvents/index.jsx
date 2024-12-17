/**
 * Created by Barry Chen
 * 260952566
 */
import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Card, Descriptions, List, Modal, Spin, Popconfirm } from "antd";
import "./style.css";
import PublishEventForm from "../../components/PublishEventForm";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../../assets/images/Logo.png";

const DescItemMap = {
  Venue: "venue",
  "Holding Date": "holdingDate",
  Description: "description",
  "Published at": "createdAt",
  Organization: "organization",
  Price: "price",
};

const items = [
  {
    label: "Venue",
    span: 1,
  },
  {
    label: "Holding Date",
    span: "filled",
  },
  {
    label: "Price",
    span: 1,
  },
  {
    label: "Organization",
    span: "filled",
  },

  {
    label: "Description",
    span: "filled",
  },
  {
    label: "Published at",
    span: "filled",
  },
];

const createDescriptionItems = (event) => {
  return items.map((item) => {
    if (item.label === "Holding Date" || item.label === "Published at") {
      return {
        ...item,
        children: dayjs(event[DescItemMap[item.label]]).format(
          "MMM/DD/YYYY  HH:mm"
        ),
      };
    }
    if (item.label === "Organization") {
      // uppercase first letter
      return {
        ...item,
        children:
          event[DescItemMap[item.label]].charAt(0).toUpperCase() +
          event[DescItemMap[item.label]].slice(1),
      };
    }
    return {
      ...item,
      children: event[DescItemMap[item.label]],
    };
  });
};

export default function PublishedEvents() {
  const [isLoading, setIsLoading] = useState(true);
  const [publishedEvents, setPublishedEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const getPublishedEvents = async () => {
    try {
      setIsLoading(true);
      const data = await customFetch("/user/events");
      setPublishedEvents(data.publishedEvents);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePublishedEvent = async (newEvent) => {
    try {
      setIsSubmitting(true);
      const data = await customFetch(`/user/events/${editingEvent._id}`, {
        method: "POST",
        body: JSON.stringify(newEvent),
      });
      if (data) toast.success("Event updated successfully");
      getPublishedEvents();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClickEvent = (event) => {
    navigate(`${event._id}`);
  };

  const handleClickEdit = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    showModal(event);
  };

  const handleClickDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const showModal = (event) => {
    setOpen(true);
    setEditingEvent(event);
  };

  const handleSubmit = (newEvent) => {
    updatePublishedEvent(newEvent);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleConfirmDelete = async (eventID) => {
    try {
      const data = await customFetch(`/user/events/${eventID}`, {
        method: "DELETE",
      });
      if (data) toast.success("Event deleted successfully");
      getPublishedEvents();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPublishedEvents();
  }, []);

  return (
    <>
      {isLoading ? (
        <Spin size="large" fullscreen />
      ) : (
        <div className="published-events-container">
          <List
            grid={{
              gutter: 48,
              xs: 1,
              lg: 2,
              xl: 2,
              xxl: 3,
            }}
            dataSource={publishedEvents}
            renderItem={(event) => (
              <List.Item className="published-event-item">
                <Card
                  key={event._id}
                  title={<h2>{event.title}</h2>}
                  style={{ height: 560 }}
                  cover={
                    event.image ? <img src={event.image} /> : <img src={Logo} />
                  }
                  onClick={() => handleClickEvent(event)}
                  actions={[
                    <EditOutlined
                      key="edit"
                      onClick={(e) => handleClickEdit(e, event)}
                      style={{ fontSize: 16 }}
                    />,
                    <Popconfirm
                      description="Confirm delete/cancel this event?"
                      onConfirm={() => handleConfirmDelete(event._id)}
                      okText="Yes"
                      cancelText="No"
                      key="setting"
                      onClick={(e) => handleClickDelete(e)}
                      onPopupClick={(e) => handleClickDelete(e)}
                    >
                      <div>
                        <DeleteOutlined style={{ fontSize: 16 }} />
                      </div>
                    </Popconfirm>,
                  ]}
                >
                  <Descriptions items={createDescriptionItems(event)} />
                </Card>
              </List.Item>
            )}
          />
          <Modal
            title="Edit Event"
            centered
            key={editingEvent?._id}
            open={open}
            footer={null}
            onCancel={handleCancel}
          >
            <PublishEventForm
              event={editingEvent}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </Modal>
        </div>
      )}
    </>
  );
}
