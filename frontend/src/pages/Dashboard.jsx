import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/Authcontext.jsx";
import "./Dashboard.css";

function Dashboard() {
    const { token, logout } = useContext(AuthContext);

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch files
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/files",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                setFiles(data.files);

            } catch (error) {
                console.log(
                    "Failed to Fetch Files:",
                    error.message
                );
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchFiles();
        }
    }, [token]);

    // Upload
    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();

        formData.append("file", selectedFile);

        try {
            const response = await fetch(
                "http://localhost:3000/api/files/upload",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const text = await response.text();

            const data = text ? JSON.parse(text) : {};

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert("File uploaded successfully");

            setFiles((prevFiles) => [
                data.file,
                ...prevFiles
            ]);

            setSelectedFile(null);

        } catch (error) {
            console.log(
                "Upload failed:",
                error.message
            );

            alert(error.message);
        }
    };

    // Download
    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/files/${fileId}/download`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = fileName;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.log(
                "Download Failed:",
                error.message
            );

            alert(error.message);
        }
    };

    // Delete
    const handleDelete = async (fileId) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/files/${fileId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert("File deleted successfully");

            setFiles((prevFiles) =>
                prevFiles.filter(
                    (file) => file._id !== fileId
                )
            );

        } catch (error) {
            console.log(
                "Delete Failed:",
                error.message
            );

            alert(error.message);
        }
    };

    // Rename
    const handleRename = async (fileId) => {
        const newName = prompt(
            "Enter new file name:"
        );

        if (!newName) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/api/files/${fileId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        originalName: newName
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert("File renamed successfully");

            setFiles((prevFiles) =>
                prevFiles.map((file) =>
                    file._id === fileId
                        ? {
                            ...file,
                            originalName:
                                data.file.originalName
                        }
                        : file
                )
            );

        } catch (error) {
            console.log(
                "Rename Failed:",
                error.message
            );

            alert(error.message);
        }
    };

    // File size formatter
    const formatFileSize = (bytes) => {
        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // File icon
    const getFileIcon = (mimeType) => {
        if (mimeType === "application/pdf") {
            return "PDF";
        }

        if (mimeType === "image/png") {
            return "PNG";
        }

        if (mimeType === "image/jpeg") {
            return "JPG";
        }

        return "FILE";
    };

    return (
        <div className="dashboard">

            {/* Background */}

            <div className="dashboard-grid"></div>

            <div className="glow glow-one"></div>
            <div className="glow glow-two"></div>

            <div className="lightning lightning-one"></div>
            <div className="lightning lightning-two"></div>
            <div className="lightning lightning-three"></div>


            {/* Main */}

            <div className="dashboard-content">

                {/* Header */}

                <header className="dashboard-header">

                    <div className="brand-section">

                        <div className="brand-mark">
                            <span></span>
                        </div>

                        <div>
                            <p className="brand-label">
                                SECURE STORAGE
                            </p>

                            <h1 className="dashboard-title">
                                SECURE VAULT
                            </h1>
                        </div>

                    </div>


                    <div className="header-right">

                        <div className="connection-status">
                            <span className="status-dot"></span>

                            <span>
                                VAULT ONLINE
                            </span>
                        </div>

                        <button
                            className="logout-button"
                            onClick={logout}
                        >
                            <span>Logout</span>
                            <span className="logout-arrow">
                                →
                            </span>
                        </button>

                    </div>

                </header>


                {/* Welcome */}

                <section className="welcome-section">

                    <div>
                        <p className="welcome-tag">
                            PRIVATE STORAGE // ENCRYPTED ACCESS
                        </p>

                        <h2>
                            Your files.
                            <span> Your control.</span>
                        </h2>

                        <p className="welcome-text">
                            Upload, manage and securely access
                            your personal files from one place.
                        </p>
                    </div>


                    <div className="vault-stats">

                        <div className="stat-box">

                            <span className="stat-label">
                                FILES
                            </span>

                            <strong>
                                {files.length}
                            </strong>

                        </div>

                        <div className="stat-box">

                            <span className="stat-label">
                                LIMIT
                            </span>

                            <strong>
                                10 MB
                            </strong>

                        </div>

                        <div className="stat-box">

                            <span className="stat-label">
                                STATUS
                            </span>

                            <strong className="online-text">
                                SECURE
                            </strong>

                        </div>

                    </div>

                </section>


                {/* Upload */}

                <section className="upload-section">

                    <div className="upload-heading">

                        <div>

                            <p className="section-index">
                                01 / UPLOAD
                            </p>

                            <h3>
                                Add a file to your vault
                            </h3>

                        </div>

                        <span className="upload-limit">
                            JPG / PNG / PDF · MAX 10 MB
                        </span>

                    </div>


                    <div className="upload-box">

                        <div className="upload-icon">
                            ↑
                        </div>


                        <div className="upload-info">

                            <p className="upload-main">
                                {selectedFile
                                    ? selectedFile.name
                                    : "Choose a file to secure"
                                }
                            </p>

                            <p className="upload-sub">
                                {selectedFile
                                    ? `${formatFileSize(selectedFile.size)} ready for upload`
                                    : "Select a JPG, PNG or PDF file"
                                }
                            </p>

                        </div>


                        <div className="upload-controls">

                            <label className="choose-button">

                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) =>
                                        setSelectedFile(
                                            e.target.files[0]
                                        )
                                    }
                                />

                                Choose File

                            </label>


                            <button
                                className="upload-button"
                                onClick={handleUpload}
                            >
                                Upload
                                <span>↗</span>
                            </button>

                        </div>

                    </div>

                </section>


                {/* Files */}

                <section className="files-section">

                    <div className="files-header">

                        <div>

                            <p className="section-index">
                                02 / STORAGE
                            </p>

                            <h3>
                                Your Files
                            </h3>

                        </div>

                        <div className="file-count">
                            {files.length}{" "}
                            {files.length === 1
                                ? "FILE"
                                : "FILES"
                            }
                        </div>

                    </div>


                    {loading ? (

                        <div className="empty-state">
                            <div className="loader"></div>

                            <p>
                                Accessing secure storage...
                            </p>
                        </div>

                    ) : files.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                +
                            </div>

                            <h4>
                                Your vault is empty
                            </h4>

                            <p>
                                Upload your first file to
                                get started.
                            </p>

                        </div>

                    ) : (

                        <div className="files-list">

                            {files.map((file, index) => (

                                <div
                                    className="file-card"
                                    key={file._id}
                                >

                                    <div className="file-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>


                                    <div className="file-type">
                                        {getFileIcon(file.mimeType)}
                                    </div>


                                    <div className="file-details">

                                        <p className="file-name">
                                            {file.originalName}
                                        </p>

                                        <div className="file-meta">

                                            <span>
                                                {formatFileSize(file.size)}
                                            </span>

                                            <span className="meta-divider">
                                                /
                                            </span>

                                            <span>
                                                {file.mimeType}
                                            </span>

                                        </div>

                                    </div>


                                    <div className="file-actions">

                                        <button
                                            className="action-button"
                                            onClick={() =>
                                                handleDownload(
                                                    file._id,
                                                    file.originalName
                                                )
                                            }
                                        >
                                            <span>↓</span>
                                            Download
                                        </button>


                                        <button
                                            className="action-button"
                                            onClick={() =>
                                                handleRename(
                                                    file._id
                                                )
                                            }
                                        >
                                            <span>↗</span>
                                            Rename
                                        </button>


                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDelete(
                                                    file._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* Footer */}

                <footer className="dashboard-footer">

                    <span>
                        SECURE VAULT SYSTEM
                    </span>

                    <span>
                        AUTHENTICATED SESSION
                    </span>

                    <span>
                        ● PROTECTED
                    </span>

                </footer>

            </div>

        </div>
    );
}

export default Dashboard;