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

            console.log("STATUS:", response.status);
            console.log("RESPONSE:", text);

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

    return (
        <div className="dashboard">

            {/* Background Effects */}

            <div className="lightning lightning-one"></div>

            <div className="lightning lightning-two"></div>

            <div className="lightning lightning-three"></div>

            <div className="dashboard-grid"></div>


            {/* Main Content */}

            <div className="dashboard-content">

                {/* Header */}

                <div className="dashboard-header">

                    <div>
                        <h2 className="dashboard-title">
                            SECURE VAULT
                        </h2>

                        <p className="dashboard-subtitle">
                            Securely manage your files
                        </p>
                    </div>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>


                {/* Upload */}

                <div className="upload-box">

                    <input
                        type="file"
                        onChange={(e) =>
                            setSelectedFile(
                                e.target.files[0]
                            )
                        }
                    />

                    <button
                        className="upload-button"
                        onClick={handleUpload}
                    >
                        Upload
                    </button>

                </div>


                {/* Files */}

                <h3 className="files-title">
                    Your Files
                </h3>


                {loading ? (

                    <p>
                        Loading Files...
                    </p>

                ) : files.length === 0 ? (

                    <p>
                        No Files Uploaded yet.
                    </p>

                ) : (

                    files.map((file) => (

                        <div
                            className="file-card"
                            key={file._id}
                        >

                            <div>

                                <p className="file-name">
                                    {file.originalName}
                                </p>

                                <p className="file-meta">
                                    {file.mimeType} •{" "}
                                    {file.size} bytes
                                </p>

                            </div>


                            <div className="file-actions">

                                <button
                                    onClick={() =>
                                        handleDownload(
                                            file._id,
                                            file.originalName
                                        )
                                    }
                                >
                                    Download
                                </button>


                                <button
                                    onClick={() =>
                                        handleDelete(
                                            file._id
                                        )
                                    }
                                >
                                    Delete
                                </button>


                                <button
                                    onClick={() =>
                                        handleRename(
                                            file._id
                                        )
                                    }
                                >
                                    Rename
                                </button>

                            </div>

                        </div>

                    ))
                )}

            </div>

        </div>
    );
}

export default Dashboard;