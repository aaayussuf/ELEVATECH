import { useState } from "react";
import ImageUploader from "../components/admin/ImageUploader";

export default function TestUpload() {
  const [image, setImage] = useState("");

  return (
    <div className="max-w-xl mx-auto mt-10 p-6">

      <h1 className="text-3xl font-bold mb-6">
        Image Upload Test
      </h1>

      <ImageUploader
        value={image}
        onChange={setImage}
      />

      <div className="mt-8">

        <h2 className="font-bold mb-2">
          Uploaded URL
        </h2>

        <textarea
          className="border rounded w-full p-3"
          rows={5}
          value={image}
          readOnly
        />

      </div>

    </div>
  );
}

