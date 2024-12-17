import "./style.css";
import CreateEventForm from "../../components/CreateEventForm";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import { useEffect } from "react";

export default function CreateEvent() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const baseURL = "../events/";
    const [eventPath, setEventPath] = useState(baseURL);
    const [navigateAfterSubmit, setNavigateAfterSubmit] = useState(false);

    async function handleSubmit(event) {
        try {
            setIsSubmitting(true);
            const response = await customFetch("/user/events", {
                method: "POST",
                body: JSON.stringify(event),
            });
            setEventPath(baseURL.concat(response.event._id));
        } catch (error) {
            toast.error(error.message);
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false);
            setNavigateAfterSubmit(true);
            toast.success("Successfully created " + event.title);
        }

    }

    useEffect(() => {
        if (navigateAfterSubmit) {
            document.getElementById("goToEventBtn").click();
            setNavigateAfterSubmit(false);
        }
    }, [navigateAfterSubmit]);

    return (
        <>
            <h1 className="page-title">Create an event</h1>
            <div className="createEvent-container">
                <CreateEventForm
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
                <Link to="../profile">
                    <div className="createEvent-btnContainer"><button className="cancel-createEvent btn-secondary btn-fullWidth">Cancel</button></div>
                </Link>
            </div >
            <Link to={eventPath}>
                <button id="goToEventBtn" hidden={true}></button>
            </Link>
        </>
    );
}
