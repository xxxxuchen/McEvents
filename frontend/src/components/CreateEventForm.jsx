import { useState } from "react";
import FormItem from "./FormItem";
import ImageUploader from "./ImageUploader/index.jsx";
import { toast } from "react-toastify";
import { DatePicker, TimePicker } from "antd";
import defaultEp from "../assets/images/Logo.png";

export default function CreateEventForm({
    onSubmit,
    isSubmitting
}) {


    const eventState = {
        title: "",
        venue: "",
        price: 0,
        holdingDate: "",
        organization: "personal",
        description: "",
        image: defaultEp,
    };

    const disabledDate = (current) => {
        const today = new Date();
        return current && current.toDate() < today;
    };

    const [eventData, setEventData] = useState(eventState);

    const handleImageUpload = (imgUrl) => {
        setEventData({ ...eventData, image: imgUrl });
    };

    function handleInputChange(e) {
        if (e.target.name === "price") {
            const newValue = e.target.value === "" ? "" : Math.max(Number(e.target.value), 0);
            setEventData({
                ...eventData,
                [e.target.name]: newValue
            });
        } else {
            setEventData({
                ...eventData,
                [e.target.name]: e.target.value
            });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const { title, venue, price, organization, holdingDate, description, image } = eventData;
        if (!price) {
            setEventData({
                ...eventData,
                price: 0
            });
        }

        if (!title || !venue || !organization || !holdingDate || !description) {
            console.log(eventData);
            toast.error("Please fill out all fields");
            return;
        }
        onSubmit(eventData);
    }

    const handleDateChange = (value) => {
        if (value) {
            const isoString = value.toISOString();
            setEventData({ ...eventData, holdingDate: isoString });
        } else {
            setEventData({ ...eventData, holdingDate: "" });
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="form event-form" id="createEventForm" name="createEventForm">
                <FormItem
                    type="text"
                    name="title"
                    value={eventData.title}
                    onChange={handleInputChange}
                    required={true}
                />
                <div className="form-row">
                    <label htmlFor="price" className="form-label">
                        Price *
                    </label>
                    <input
                        id="price"
                        type="number"
                        name="price"
                        min="0"
                        value={eventData.price}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>
                <FormItem
                    type="text"
                    name="venue"
                    value={eventData.venue}
                    onChange={handleInputChange}
                    required={true}
                />
                <div className="form-row">
                    <label className="form-label" htmlFor="datpicker">Holding Date *</label>
                    <DatePicker
                        showTime={true}
                        onChange={handleDateChange}
                        format="MMM/DD/YYYY  HH:mm"
                        id="datpicker"
                        name="datpicker"
                        disabledDate={disabledDate}
                    />
                </div>
                <div className="form-row">
                    <label htmlFor="organization" className="form-label">Organization *</label>
                    <select name="organization" id="organization" className="form-input" onChange={handleInputChange}>
                        <option value="personal">Personal</option>
                        <option value="club">Club</option>
                        <option value="department">Department</option>
                    </select>
                </div>
                <div className="form-row">
                    <label htmlFor="description" className="form-label">Description *</label>
                    <textarea name="description" id="description" className="textareaInput form-input" onChange={handleInputChange} />
                </div>
                <div className="form-row">
                    <label className="form-label">Event poster *</label>
                    <ImageUploader
                        onImageUpload={handleImageUpload}
                        showImage={true}
                        initialImage={eventData.image}
                    />
                </div>
                <button
                    type="submit"
                    className="btn submit-btn btn-fullWidth"
                    disabled={isSubmitting}
                >
                    Create Event!
                </button>
            </form>
        </>
    );

}
