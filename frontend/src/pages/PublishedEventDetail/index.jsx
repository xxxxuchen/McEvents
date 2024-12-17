/**
 * Created by Barry Chen
 * 260952566
 */

import { useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Descriptions, Spin } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import dayjs from "dayjs";

const DescItems = [
  {
    key: "1",
    label: "Account Name",
  },
  {
    key: "2",
    label: "Email",
  },
  {
    key: "3",
    label: "Participation Name",
  },
  {
    key: "4",
    label: "Faculty",
  },
  {
    key: "5",
    label: "Major",
  },
  {
    key: "6",
    label: "McGill ID",
  },
  {
    key: "7",
    label: "Phone",
  },
  {
    key: "8",
    label: "Registered At",
    span: 2,
  },
  {
    key: "9",
    label: "Comment",
    span: 3,
  },
];

const descMap = {
  "Account Name": "userAccountName",
  Email: "email",
  "Participation Name": "participationName",
  Faculty: "faculty",
  Major: "major",
  "McGill ID": "McGillID",
  Phone: "phone",
  Comment: "comment",
  "Registered At": "registeredAt",
};

const createDescriptionItems = (registrationItem) =>
  DescItems.map(({ label, ...rest }) => ({
    ...rest,
    label,
    children:
      label === "Registered At"
        ? dayjs(registrationItem[descMap[label]]).format("MMM/DD/YYYY HH:mm")
        : registrationItem[descMap[label]] || "",
  }));

export default function PublishedEventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [userRegistrationList, setUserRegistrationList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRegistration() {
      setIsLoading(true);
      try {
        const { registrationDetails } = await customFetch(
          `/events/registration/${eventId}`
        );
        if (registrationDetails.length === 0) {
          return setUserRegistrationList([]);
        }
        const userRegistrationListFlatten = registrationDetails.map((item) => {
          return {
            userAccountName: item.user.name,
            email: item.user.email,
            ...item.registrationInfo,
          };
        });
        console.log("userRegistrationListFlatten", userRegistrationListFlatten);
        setUserRegistrationList(userRegistrationListFlatten);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRegistration();
  }, [eventId]);

  return (
    <>
      {isLoading ? (
        <Spin size="large" fullscreen />
      ) : (
        <div className="registration-container">
          <div className="back-arrow">
            <button
              className="btn-secondary back-button"
              onClick={() => navigate(-1)}
            >
              <ArrowLeftOutlined />
              <span>Go Back</span>
            </button>
          </div>
          <div className="registration-details">
            <h2>Registration Info:</h2>
            {userRegistrationList.length === 0 && (
              <h3>No one has registered for this event yet.</h3>
            )}
            <div className="registration-list">
              {userRegistrationList.map((registrationItem, i) => {
                return (
                  <Descriptions
                    key={i}
                    title={`Registered User ${i + 1}`}
                    layout="vertical"
                    bordered
                    items={createDescriptionItems(registrationItem)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
