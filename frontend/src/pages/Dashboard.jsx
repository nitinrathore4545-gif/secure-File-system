import {
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import { AuthContext } from "../context/Authcontext.jsx";
import "./Dashboard.css";

function Dashboard() {

    const { token, logout } = useContext(AuthContext);

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [totalFiles, setTotalFiles] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Toast
    const [toast, setToast] = useState(null);

    // Refresh files
    const [refresh, setRefresh] = useState(0);

    // Rename modal
    const [renameFile, setRenameFile] = useState(null);
    const [renameName, setRenameName] = useState("");


    // =========================
    // TOAST
    // =========================

    const showToast = (message, type = "success") => {

        setToast({
            message,
            type
        });

    };


    useEffect(() => {

        if (!toast) {
            return;
        }

        const timer = setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => clearTimeout(timer);

    }, [toast]);


    // =========================
    // FETCH FILES
    // =========================

    useEffect(() => {

        const fetchFiles = async () => {

            try {

                setLoading(true);

                const response = await fetch(
                    `http://localhost:3000/api/files?search=${encodeURIComponent(
                        search
                    )}&page=${page}&limit=${limit}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to fetch files"
                    );

                }

                setFiles(data.files);
                setTotalFiles(data.totalFiles);
                setTotalPages(data.totalPages);

            } catch (error) {

                console.log(
                    "Failed to Fetch Files:",
                    error.message
                );

                showToast(
                    error.message ||
                    "Failed to fetch files",
                    "error"
                );

            } finally {

                setLoading(false);

            }
        };


        if (token) {
            fetchFiles();
        }

    }, [
        token,
        search,
        page,
        limit,
        refresh
    ]);


    // =========================
    // SEARCH
    // =========================

    const handleSearch = (e) => {

        setSearch(e.target.value);
        setPage(1);

    };


    // =========================
    // SELECT FILES
    // =========================

    const handleFileSelect = (e) => {

        const selected = Array.from(
            e.target.files
        );


        if (selected.length > 5) {

            showToast(
                "You can upload maximum 5 files at once",
                "error"
            );

            e.target.value = "";

            return;
        }


        setSelectedFiles(selected);

    };


    // =========================
    // CANCEL SELECTED FILES
    // =========================

    const handleCancelSelection = () => {

        setSelectedFiles([]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

    };


    // =========================
    // UPLOAD
    // =========================

    const handleUpload = async () => {

        if (selectedFiles.length === 0) {

            showToast(
                "Please select at least one file",
                "error"
            );

            return;
        }


        const formData = new FormData();


        selectedFiles.forEach((file) => {

            formData.append(
                "files",
                file
            );

        });


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


            const text =
                await response.text();


            const data = text
                ? JSON.parse(text)
                : {};


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "File upload failed"
                );

            }


            showToast(
                `${data.files.length} file${
                    data.files.length === 1
                        ? ""
                        : "s"
                } uploaded successfully`,
                "success"
            );


            setSelectedFiles([]);


            const input =
                document.querySelector(
                    ".choose-button input"
                );


            if (input) {
                input.value = "";
            }


            setPage(1);

            setRefresh(
                (prev) => prev + 1
            );


        } catch (error) {

            console.log(
                "Upload failed:",
                error.message
            );

            showToast(
                error.message ||
                "File upload failed",
                "error"
            );

        }
    };


    // =========================
    // DOWNLOAD
    // =========================

    const handleDownload = async (
        fileId,
        fileName
    ) => {

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

                const data =
                    await response.json();

                throw new Error(
                    data.message ||
                    "Download failed"
                );

            }


            const blob =
                await response.blob();


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href = url;
            link.download = fileName;


            document.body.appendChild(link);

            link.click();

            link.remove();


            window.URL.revokeObjectURL(
                url
            );


            showToast(
                "File downloaded successfully",
                "success"
            );


        } catch (error) {

            console.log(
                "Download Failed:",
                error.message
            );

            showToast(
                error.message ||
                "Download failed",
                "error"
            );

        }
    };


    // =========================
    // DELETE
    // =========================

    const handleDelete = async (
        fileId
    ) => {

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


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "File deletion failed"
                );

            }


            showToast(
                "File deleted successfully",
                "success"
            );


            setRefresh(
                (prev) => prev + 1
            );


        } catch (error) {

            console.log(
                "Delete Failed:",
                error.message
            );

            showToast(
                error.message ||
                "File deletion failed",
                "error"
            );

        }
    };


    // =========================
    // OPEN RENAME MODAL
    // =========================

    const handleRename = (
        fileId,
        currentName
    ) => {

        setRenameFile(fileId);
        setRenameName(currentName);

    };


    // =========================
    // CLOSE RENAME MODAL
    // =========================

    const closeRenameModal = () => {

        setRenameFile(null);
        setRenameName("");

    };


    // =========================
    // SUBMIT RENAME
    // =========================

    const submitRename = async () => {

        if (!renameName.trim()) {

            showToast(
                "File name cannot be empty",
                "error"
            );

            return;
        }


        try {

            const response = await fetch(
                `http://localhost:3000/api/files/${renameFile}`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        originalName:
                            renameName.trim()
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "File rename failed"
                );

            }


            showToast(
                "File renamed successfully",
                "success"
            );


            closeRenameModal();


            setRefresh(
                (prev) => prev + 1
            );


        } catch (error) {

            console.log(
                "Rename Failed:",
                error.message
            );

            showToast(
                error.message ||
                "File rename failed",
                "error"
            );

        }
    };


    // =========================
    // FILE SIZE
    // =========================

    const formatFileSize = (
        bytes
    ) => {

        if (bytes < 1024) {
            return `${bytes} B`;
        }


        if (
            bytes <
            1024 * 1024
        ) {

            return `${(
                bytes / 1024
            ).toFixed(1)} KB`;

        }


        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(1)} MB`;

    };


    // =========================
    // FILE ICON
    // =========================

    const getFileIcon = (
        mimeType
    ) => {

        if (
            mimeType ===
            "application/pdf"
        ) {
            return "PDF";
        }


        if (
            mimeType ===
            "image/png"
        ) {
            return "PNG";
        }


        if (
            mimeType ===
            "image/jpeg"
        ) {
            return "JPG";
        }


        return "FILE";

    };


    return (

        <div className="dashboard">


            {/* =========================
                TOAST
            ========================= */}

            {toast && (

                <div
                    className={`vault-toast ${
                        toast.type === "error"
                            ? "vault-toast-error"
                            : "vault-toast-success"
                    }`}
                >

                    <div className="vault-toast-indicator"></div>


                    <div className="vault-toast-content">

                        <strong>
                            {toast.type === "error"
                                ? "ERROR"
                                : "SUCCESS"}
                        </strong>


                        <span>
                            {toast.message}
                        </span>

                    </div>


                    <button
                        className="vault-toast-close"
                        onClick={() =>
                            setToast(null)
                        }
                    >
                        ×
                    </button>

                </div>

            )}


            {/* =========================
                RENAME MODAL
            ========================= */}

            {renameFile && (

                <div
                    className="rename-overlay"
                    onClick={closeRenameModal}
                >

                    <div
                        className="rename-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="rename-header">

                            <div>

                                <p className="section-index">
                                    FILE MANAGEMENT
                                </p>

                                <h3>
                                    Rename File
                                </h3>

                            </div>


                            <button
                                className="rename-close"
                                onClick={
                                    closeRenameModal
                                }
                            >
                                ×
                            </button>

                        </div>


                        <input
                            type="text"
                            value={renameName}
                            onChange={(e) =>
                                setRenameName(
                                    e.target.value
                                )
                            }
                            autoFocus
                            maxLength={255}
                            onKeyDown={(e) => {

                                if (
                                    e.key ===
                                    "Enter"
                                ) {
                                    submitRename();
                                }

                                if (
                                    e.key ===
                                    "Escape"
                                ) {
                                    closeRenameModal();
                                }

                            }}
                        />


                        <div className="rename-actions">

                            <button
                                className="action-button"
                                onClick={
                                    closeRenameModal
                                }
                            >
                                Cancel
                            </button>


                            <button
                                className="upload-button"
                                onClick={
                                    submitRename
                                }
                            >
                                Rename

                                <span>
                                    ↗
                                </span>

                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =========================
                BACKGROUND
            ========================= */}

            <div className="dashboard-grid"></div>

            <div className="glow glow-one"></div>

            <div className="glow glow-two"></div>

            <div className="lightning lightning-one"></div>

            <div className="lightning lightning-two"></div>

            <div className="lightning lightning-three"></div>


            {/* =========================
                MAIN
            ========================= */}

            <div className="dashboard-content">


                {/* HEADER */}

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

                            <span>
                                Logout
                            </span>

                            <span className="logout-arrow">
                                →
                            </span>

                        </button>

                    </div>

                </header>


                {/* WELCOME */}

                <section className="welcome-section">

                    <div>

                        <p className="welcome-tag">
                            PRIVATE STORAGE // ENCRYPTED ACCESS
                        </p>


                        <h2>

                            Your files.

                            <span>
                                {" "}Your control.
                            </span>

                        </h2>


                        <p className="welcome-text">

                            Upload, manage and securely access
                            your personal files from one place.

                        </p>

                    </div>


                    <div className="vault-stats">

                        <div className="stat-box">
                            <span className="stat-number">01</span>

                            <span className="stat-label">
                                FILES IN VAULT
                            </span>

                            <strong>
                                {totalFiles}
                            </strong>

                            <span className="stat-line"></span>
                        </div>


                        <div className="stat-box">
                            <span className="stat-number">02</span>

                            <span className="stat-label">
                                FILE LIMIT
                            </span>

                            <strong>
                                10 MB
                            </strong>

                            <span className="stat-line"></span>
                        </div>


                        <div className="stat-box">
                            <span className="stat-number">03</span>

                            <span className="stat-label">
                                VAULT STATUS
                            </span>

                            <strong className="online-text">
                                SECURE
                            </strong>

                            <span className="stat-line"></span>
                        </div>

                    </div>

                </section>


                {/* UPLOAD */}

                <section className="upload-section">

                    <div className="upload-heading">

                        <div>

                            <p className="section-index">
                                01 / UPLOAD
                            </p>

                            <h3>
                                Add files to your vault
                            </h3>

                        </div>


                        <span className="upload-limit">
                            JPG / PNG / PDF · MAX 10 MB · MAX 5 FILES
                        </span>

                    </div>


                    <div className="upload-box">

                        <span className="upload-corner upload-corner-tl"></span>
                        <span className="upload-corner upload-corner-br"></span>

                        <div className="upload-icon">
                            <span>↑</span>
                        </div>


                        <div className="upload-info">

                            <div className="upload-main-row">
                                <p className="upload-main">

                                {selectedFiles.length > 0

                                    ? `${selectedFiles.length} file${
                                        selectedFiles.length === 1
                                            ? ""
                                            : "s"
                                    } selected`

                                    : "Choose files to secure"

                                }

                                </p>

                                {selectedFiles.length > 0 && (
                                    <>
                                        <span className="selected-badge">
                                            READY
                                        </span>

                                        <button
                                            type="button"
                                            className="cancel-selection"
                                            onClick={handleCancelSelection}
                                        >
                                            CANCEL
                                        </button>
                                    </>
                                )}
                            </div>


                            <p className="upload-sub">

                                {selectedFiles.length > 0

                                    ? selectedFiles
                                        .map(
                                            (file) =>
                                                file.name
                                        )
                                        .join(", ")

                                    : "Select JPG, PNG or PDF files"

                                }

                            </p>

                        </div>


                        <div className="upload-controls">

                            <label className="choose-button">

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    multiple
                                    onChange={
                                        handleFileSelect
                                    }
                                />

                                Choose Files

                            </label>


                            <button
                                className="upload-button"
                                onClick={
                                    handleUpload
                                }
                            >

                                Upload

                                <span>
                                    ↗
                                </span>

                            </button>

                        </div>

                    </div>

                </section>


                {/* FILES */}

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

                            {totalFiles}{" "}

                            {totalFiles === 1
                                ? "FILE"
                                : "FILES"
                            }

                        </div>

                    </div>


                    {/* SEARCH */}

                    <div className="search-shell">
                        <div className="search-icon">
                            /
                        </div>

                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Search your vault..."
                        />

                        <span className="search-hint">
                            {search ? "FILTER ACTIVE" : "SEARCH"}
                        </span>
                    </div>


                    {/* FILE LIST */}

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

                                {search
                                    ? "No matching files"
                                    : "Your vault is empty"
                                }

                            </h4>


                            <p>

                                {search
                                    ? "Try a different file name."
                                    : "Upload your first file to get started."
                                }

                            </p>

                        </div>

                    ) : (

                        <div className="files-list">

                            {files.map(
                                (file, index) => (

                                    <div
                                        className="file-card"
                                        key={file._id}
                                    >

                                        <div className="file-scan-line"></div>

                                        <div className="file-number">

                                            {String(
                                                (page - 1) *
                                                limit +
                                                index +
                                                1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}

                                        </div>


                                        <div className="file-type">

                                            {getFileIcon(
                                                file.mimeType
                                            )}

                                        </div>


                                        <div className="file-details">

                                            <div className="file-name-row">
                                                <p className="file-name">
                                                    {file.originalName}
                                                </p>

                                                <span className="file-secure-badge">
                                                    SECURED
                                                </span>
                                            </div>


                                            <div className="file-meta">

                                                <span>
                                                    {formatFileSize(
                                                        file.size
                                                    )}
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

                                                <span>
                                                    ↓
                                                </span>

                                                Download

                                            </button>


                                            <button
                                                className="action-button"
                                                onClick={() =>
                                                    handleRename(
                                                        file._id,
                                                        file.originalName
                                                    )
                                                }
                                            >

                                                <span>
                                                    ↗
                                                </span>

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

                                )
                            )}

                        </div>

                    )}


                    {/* PAGINATION */}

                    {totalPages > 1 && (

                        <div className="pagination">

                            <button
                                className="action-button"
                                disabled={
                                    page === 1
                                }
                                onClick={() =>
                                    setPage(
                                        (prev) =>
                                            prev - 1
                                    )
                                }
                            >
                                ← Previous
                            </button>


                            <span>
                                PAGE {page} / {totalPages}
                            </span>


                            <button
                                className="action-button"
                                disabled={
                                    page === totalPages
                                }
                                onClick={() =>
                                    setPage(
                                        (prev) =>
                                            prev + 1
                                    )
                                }
                            >
                                Next →
                            </button>

                        </div>

                    )}

                </section>


                {/* FOOTER */}

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