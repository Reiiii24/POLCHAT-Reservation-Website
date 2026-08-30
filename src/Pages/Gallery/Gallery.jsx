import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { supabase } from "../../lib/supabaseClient";

import "./Gallery.css";

const GALLERY_BUCKET = "gallery";

function buildPublicUrl(path) {
  const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function getFileExtension(file) {
  const nameParts = file.name.split(".");

  if (nameParts.length > 1) {
    return nameParts.pop().toLowerCase();
  }

  if (file.type?.includes("/")) {
    return file.type.split("/").pop().toLowerCase();
  }

  return "jpg";
}

function formatPhotoTitle(fileName) {
  const nameWithoutExtension = fileName.replace(/\.[^.]+$/, "");

  return nameWithoutExtension
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function Gallery() {
  const location = useLocation();
  const isAdminView = location.pathname.startsWith("/admin");

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState("");
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activePhoto, setActivePhoto] = useState(null);

  const fetchPhotos = async () => {
    setLoading(true);
    setError("");

    const { data, error: listError } = await supabase.storage.from(GALLERY_BUCKET).list("", {
      sortBy: { column: "created_at", order: "desc" },
    });

    if (listError) {
      setError("Unable to load gallery photos.");
      setLoading(false);
      return;
    }

    setPhotos((data || []).filter((item) => item.name));
    setLoading(false);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const photoItems = useMemo(
    () =>
      photos.map((photo) => ({
        ...photo,
        title: formatPhotoTitle(photo.name),
        url: buildPublicUrl(photo.name),
      })),
    [photos]
  );

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!isAdminView) {
      return;
    }

    if (!selectedFiles.length) {
      setError("Select at least one image.");
      return;
    }

    setUploading(true);
    setError("");

    for (const file of selectedFiles) {
      const extension = getFileExtension(file);
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${extension}`;

      const { error: uploadError } = await supabase.storage.from(GALLERY_BUCKET).upload(path, file, {
        upsert: false,
        contentType: file.type,
      });

      if (uploadError) {
        console.error(uploadError);
        setError(uploadError.message || "Unable to upload one or more images.");
        setUploading(false);
        return;
      }
    }

    setSelectedFiles([]);
    event.target.reset();
    await fetchPhotos();
    setUploading(false);
  };

  const handleDelete = async (photoName) => {
    if (!isAdminView || deletingPhoto) {
      return;
    }

    setDeletingPhoto(photoName);
    setError("");

    const { error: deleteError } = await supabase.storage
      .from(GALLERY_BUCKET)
      .remove([photoName]);

    if (deleteError) {
      console.error(deleteError);
      setError(deleteError.message || "Unable to delete the photo.");
      setDeletingPhoto("");
      return;
    }

    if (activePhoto?.name === photoName) {
      setActivePhoto(null);
    }

    await fetchPhotos();
    setDeletingPhoto("");
  };

  return (
    <section className="gallery-page">
      <div className="gallery-shell">
        <div className="gallery-header-row">
          <div className="gallery-header">
            <p>{isAdminView ? "Admin Gallery" : "Resort Gallery"}</p>
            <h1>{isAdminView ? "Manage Gallery" : "Gallery"}</h1>
          </div>

          {isAdminView && (
            <form className="gallery-upload-panel" onSubmit={handleUpload}>
              <label className="gallery-file-field">
                <span>Select photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                />
              </label>

              <div className="gallery-upload-actions">
                <p>
                  {selectedFiles.length
                    ? `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} selected`
                    : "No files selected"}
                </p>

                <button type="submit" disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Photos"}
                </button>
              </div>
            </form>
          )}
        </div>

        {error && <p className="gallery-error">{error}</p>}

        {loading ? (
          <p className="gallery-state">Loading photos...</p>
        ) : (
          <div className="gallery-grid">
            {photoItems.map((photo) => (
              <figure className="gallery-item" key={photo.name}>
                <button
                  type="button"
                  className="gallery-photo-button"
                  onClick={() => setActivePhoto(photo)}
                  aria-label={`View ${photo.title || photo.name}`}
                >
                  <img src={photo.url} alt={photo.title || photo.name} />
                </button>

                <figcaption className="gallery-item-bar">
                  <span>{photo.title || photo.name}</span>

                  {isAdminView && (
                    <button
                      type="button"
                      className="gallery-delete-button"
                      onClick={() => handleDelete(photo.name)}
                      disabled={deletingPhoto === photo.name}
                    >
                      {deletingPhoto === photo.name ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      {activePhoto && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title || activePhoto.name}
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="gallery-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="gallery-lightbox-close"
              aria-label="Close photo viewer"
              onClick={() => setActivePhoto(null)}
            >
              ×
            </button>

            <img
              className="gallery-lightbox-image"
              src={activePhoto.url}
              alt={activePhoto.title || activePhoto.name}
            />

            <div className="gallery-lightbox-caption">
              <strong>{activePhoto.title || activePhoto.name}</strong>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
