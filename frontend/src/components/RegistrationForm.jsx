import FormItem from "./FormItem";
import { useState } from "react";
import { toast } from "react-toastify";

export default function RegistrationForm({ onSubmit, eventTitle, leavePage }) {

    const registrationState = {
        participationName: "",
        McGillID: "",
        faculty: "",
        major: "",
        phone: "",
        comment: ""
    };

    const [registrationData, setRegistration] = useState(registrationState);

    function handleInputChange(e) {
        setRegistration({
            ...registrationData,
            [e.target.name]: e.target.value
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const { participationName, McGillID, faculty, major, phone, comment } = registrationData;
        if (!participationName || !McGillID || !faculty || !major || !phone) {
            toast.error("Please fill out all required fields");
            return;
        } else {
            onSubmit(registrationData);
        }
    }



    return (
        <div className="register-form-section">
            <h1 className="event-title">Register for <span >{eventTitle}</span></h1>
            <form onSubmit={handleSubmit} id="registerEventForm" name="registerEventForm">
                <FormItem
                    type="text"
                    name="participationName"
                    label="Participation Name"
                    value={registrationData.participationName}
                    onChange={handleInputChange}
                    required={true}
                />
                <FormItem
                    type="text"
                    name="McGillID"
                    label="McGill ID"
                    value={registrationData.McGillID}
                    onChange={handleInputChange}
                    required={true}
                />
                <FormItem
                    type="text"
                    name="faculty"
                    value={registrationData.faculty}
                    onChange={handleInputChange}
                    required={true}
                />
                <FormItem
                    type="text"
                    name="major"
                    value={registrationData.major}
                    onChange={handleInputChange}
                    required={true}
                />
                <FormItem
                    type="text"
                    name="phone"
                    label="Phone number"
                    value={registrationData.phone}
                    onChange={handleInputChange}
                    required={true}
                />
                <div className="form-row">
                    <label htmlFor="comment" className="form-label">Comment</label>
                    <textarea name="comment" id="comment" className="textareaInput form-input" onChange={handleInputChange} />
                </div>
                <button
                    type="submit"
                    className="btn submit-btn btn-fullWidth"
                >
                    Register!
                </button>
            </form>
            <button
                onClick={leavePage}
                className="btn btn-secondary submit-btn btn-fullWidth cancel-registerEvent"
            >
                Cancel
            </button>
        </div>
    );

}