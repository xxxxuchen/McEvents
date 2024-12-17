/**
 * Created by Barry Chen
 * 260952566
 */
import { useState } from "react";
import "./style.css";
import { toast } from "react-toastify";
import { EditOutlined } from "@ant-design/icons";
import customFetch from "../../utils/customFetch";

const getBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => resolve(e.target.result);
  });
};

function ImageUploader({
  onImageUpload,
  showImage = true,
  rounded = false,
  initialImage = "",
}) {
  const [previewImage, setPreviewImage] = useState(initialImage);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const data = await customFetch("/user/uploads", {
        method: "POST",
        body: formData,
      });
      const base64 = await getBase64(file);
      setPreviewImage(base64);
      onImageUpload(data.imageSrc);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    // check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    uploadImage(file);
  };

  return (
    <div className="upload-container">
      <label
        htmlFor="file-upload"
        className={rounded ? "upload-box upload-box--round" : "upload-box"}
      >
        {previewImage && showImage ? (
          <>
            <img src={previewImage} alt="preview" className="preview-image" />
            <div className="image-edit-button">
              <EditOutlined />
            </div>
          </>
        ) : (
          <>
            <span className="plus-icon">+</span>
            <span className="upload-text">Upload</span>
          </>
        )}
      </label>
      <input
        id="file-upload"
        type="file"
        className="file-input"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ImageUploader;
