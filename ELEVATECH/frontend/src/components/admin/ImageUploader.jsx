import { useRef, useState } from "react";
import uploadService from "../../services/uploadService";

export default function ImageUploader({
  value,
  onChange,
  label = "Upload Image",
}) {
  const inputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file) {
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const url = await uploadService.uploadImage(file);
      onChange(url);
    } catch (err) {
      console.error(err);
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e) {
    handleFile(e.target.files[0]);
  }

  function removeImage() {
    onChange("");
  }

  return (
    <div className="space-y-3">

      <label className="block font-semibold">
        {label}
      </label>

      {value ? (
        <div className="space-y-2">

          <img
            src={value}
            alt="Preview"
            className="w-40 h-40 object-cover rounded border"
          />

          <button
            type="button"
            onClick={removeImage}
            className="text-red-600 text-sm hover:underline"
          >
            Remove Image
          </button>

        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-500"
        >
          {uploading
            ? "Uploading..."
            : "Click to choose image"}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onInputChange}
      />

      {error && (
        <p className="text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}

