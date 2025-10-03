'use client';
import '@/app/style.css';
import './appstatus.css'
import { useRef, useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Assuming Next.js App Router for dynamic routes
import Cookies from 'js-cookie'; // To get authentication token
import { FaSpinner, FaCloudUploadAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Icons

export default function ApplicationStatusPage() {
    const params = useParams();
    const applicationId = params.id; // Get application ID from URL, e.g., /application-status/[id]

    const [application, setApplication] = useState(null);
    const [applicationsList, setApplicationsList] = useState([]); // If you also want to display a list
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); // For update-status API
    const [isUpdatingSchedule, setIsUpdatingSchedule] = useState(false); // For update-schedule API
    const [isPayingFee, setIsPayingFee] = useState(false); // For first-fee-payment API

    const fileInputRef = useRef(null);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [uploadMessage, setUploadMessage] = useState('');
    const [uploadError, setUploadError] = useState(null);


    // Dynamic steps based on application status
    const getTimelineSteps = (currentStatus) => {
        // Define all possible steps in order
        const allSteps = [
            { name: 'Applied', key: 'applied' },
            { name: 'Interview', key: 'interview' },
            { name: 'Demo', key: 'demo' },
            { name: 'Fee Due', key: 'fee_due' }, // Changed from 'Fee' to 'Fee Due' for clarity
            { name: 'Enrolled', key: 'enrolled' },
            { name: 'Approved', key: 'approved' }, // Added Approved, might be a final state before enrolled or parallel
            { name: 'Rejected', key: 'rejected' }, // Handle rejected state visually
        ];

        let foundCurrent = false;
        return allSteps.map((step) => {
            let completed = false;
            let current = false;

            if (currentStatus === step.key) {
                current = true;
                foundCurrent = true; // Mark that we've found the current status
            } else if (!foundCurrent && currentStatus !== 'rejected') {
                // All steps before the current one are completed, unless it's rejected
                completed = true;
            }

            // Special handling for rejected status
            if (currentStatus === 'rejected' && step.key === 'rejected') {
                completed = true; // The rejected step itself is completed if application is rejected
            }

            // If a step is 'fee_due' and the application status is 'enrolled' or 'approved',
            // then 'fee_due' should be marked as completed.
            if (step.key === 'fee_due' && (currentStatus === 'enrolled' || currentStatus === 'approved')) {
                completed = true;
            }

            // If a step is 'interview' or 'demo' and the status is 'approved'/'enrolled',
            // these past steps should be completed.
            if ((step.key === 'interview' || step.key === 'demo') &&
                (currentStatus === 'approved' || currentStatus === 'enrolled' || currentStatus === 'fee_due')) {
                completed = true;
            }

            return {
                ...step,
                completed: completed,
                current: current,
                isRejected: currentStatus === 'rejected' && step.key === 'rejected',
            };
        }).filter(step => {
            // Filter out 'Rejected' step if application is not rejected, to keep timeline clean
            // Or only show 'Approved' if it's the final state. Adjust based on your workflow.
            if (step.key === 'rejected' && currentStatus !== 'rejected') return false;
            if (step.key === 'approved' && currentStatus !== 'approved' && currentStatus !== 'enrolled') return false;
            return true;
        });
    };


    // --- API Integration Functions ---

    const getAuthHeader = () => {
        const token = Cookies.get('accessToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    const fetchApplicationDetails = async () => {
        if (!applicationId) {
            setError("Application ID is missing.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/detail/${applicationId}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to fetch application details.');
            }

            const data = await res.json();
            // Assuming the API returns a single "application" object and maybe an "applications" list
            setApplication(data.application);
            setApplicationsList(data.applications || []); // Set list if provided
        } catch (err) {
            console.error("Fetch application details error:", err);
            setError(err.message || "Could not load application details.");
        } finally {
            setLoading(false);
        }
    };

    // This function would typically be called from another page (e.g., after a course selection)
    const submitCourseApplication = async (studentId, courseId, teacherId, amount) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({ student_id: studentId, course_id: courseId, teacher_id: teacherId, amount: amount }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to submit application.');
            }

            const data = await res.json();
            alert(data.message); // Show success message
            // You might want to redirect to the application status page or refresh the list
        } catch (err) {
            console.error("Submit application error:", err);
            alert(err.message || "Error submitting application.");
        }
    };

    // For admin/teacher to update schedule (e.g., from a dashboard, not directly on this page)
    const updateSchedule = async (newInterviewDate) => {
        if (!application) return; // Ensure application data is loaded
        setIsUpdatingSchedule(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/${application.id}/update-schedule/`, {
                method: 'PATCH', // Assuming PATCH based on common REST practices for partial updates
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({ interview_date: newInterviewDate }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update schedule.');
            }

            const data = await res.json();
            alert(data.message);
            fetchApplicationDetails(); // Re-fetch to update UI
        } catch (err) {
            console.error("Update schedule error:", err);
            alert(err.message || "Error updating schedule.");
        } finally {
            setIsUpdatingSchedule(false);
        }
    };

    // For admin/teacher to update status (e.g., from a dashboard, not directly on this page)
    const updateApplicationStatus = async (newStatus) => {
        if (!application) return;
        setIsUpdatingStatus(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/${application.id}/update-status/`, {
                method: 'PATCH', // Assuming PATCH
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update status.');
            }

            const data = await res.json();
            alert(data.message);
            fetchApplicationDetails(); // Re-fetch to update UI
        } catch (err) {
            console.error("Update status error:", err);
            alert(err.message || "Error updating status.");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    // For the user to make the first fee payment
    const handleFirstFeePayment = async () => {
        if (!application || application.status !== 'fee_due') {
            alert("Fee payment is not due for this application.");
            return;
        }

        setIsPayingFee(true);
        try {
            // You'd typically collect payment details here (e.g., card info)
            // For now, sending minimal required info as per your API doc
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/first-fee-payment/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({
                    application_id: application.id,
                    student_id: application.student_id, // Assuming these are part of application object
                    // ... other payment specific data if required by your API
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to process fee payment.');
            }

            const data = await res.json();
            alert(data.message); // Show success message
            fetchApplicationDetails(); // Re-fetch to update UI (status should change to 'enrolled' or 'approved')
        } catch (err) {
            console.error("Fee payment error:", err);
            alert(err.message || "Error processing fee payment.");
        } finally {
            setIsPayingFee(false);
        }
    };


    useEffect(() => {
        fetchApplicationDetails();
    }, [applicationId]); // Re-fetch when ID changes

    // --- File Upload Logic (Existing) ---
    const handleUploadClick = () => {
        setUploadMessage('');
        setUploadError(null);
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFileName(file.name);
            setUploadMessage('Uploading...');
            setUploadError(null);

            const formData = new FormData();
            formData.append('document', file);
            // Assuming an API endpoint for file uploads, e.g., for application documents
            // You'll need to define this API endpoint and its requirements.
            // This is a hypothetical endpoint.
            try {
                const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/${applicationId}/upload-document/`, {
                    method: 'POST',
                    headers: {
                        // 'Content-Type': 'multipart/form-data' is typically handled by browser for FormData
                        ...getAuthHeader(),
                    },
                    body: formData,
                });

                if (uploadRes.ok) {
                    setUploadMessage('Document uploaded successfully!');
                } else {
                    const errorData = await uploadRes.json();
                    setUploadError(errorData.message || 'Failed to upload document.');
                    setUploadMessage('');
                }
            } catch (err) {
                console.error("File upload error:", err);
                setUploadError('An error occurred during upload.');
                setUploadMessage('');
            }
        }
    };


    if (loading) {
        return (
            <main className="page-container flex items-center justify-center">
                <div className="loading-content">
                    <FaSpinner className="loading-spinner text-fc800a animate-spin text-4xl" />
                    <h2 className="loading-text text-lg mt-4">Loading application status...</h2>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page-container flex items-center justify-center">
                <div className="text-center">
                    <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-700">Error: {error}</h2>
                    <p className="text-gray-600 mt-2">Please try refreshing the page or contact support.</p>
                </div>
            </main>
        );
    }

    if (!application) {
        return (
            <main className="page-container flex items-center justify-center">
                <div className="text-center">
                    <FaTimesCircle className="text-gray-500 text-5xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700">Application not found.</h2>
                    <p className="text-gray-600 mt-2">Please ensure you have the correct application ID.</p>
                </div>
            </main>
        );
    }

    const timelineSteps = getTimelineSteps(application.status);
    const isFeeDue = application.status === 'fee_due';
    const isRejected = application.status === 'rejected';


    return (
        <main className="page-container">
            <section className="card">
                <h1>Application Status</h1>
                <p className="status-details">Application ID: {application.id}</p>
                <p className="status-details">
                    Status: <span className="font-semibold text-fc800a capitalize">{application.status.replace(/_/g, ' ')}</span>
                </p>
                {application.last_updated && (
                    <p className="status-details">Last Updated: {new Date(application.last_updated).toLocaleDateString()}</p>
                )}
                {application.interview_date && (
                    <p className="status-details">Interview Date: {new Date(application.interview_date).toLocaleString()}</p>
                )}
                {application.demo_date && ( // Assuming a demo_date field might exist
                    <p className="status-details">Demo Date: {new Date(application.demo_date).toLocaleString()}</p>
                )}

                {/* Timeline */}
                <div className="timeline">
                    <div className="timeline-line"></div>
                    {timelineSteps.map((step) => (
                        <div key={step.name} className="step">
                            <div
                                className={`step-circle ${step.completed ? 'completed' : ''} ${step.isRejected ? 'rejected-step' : ''}`}
                            >
                                {step.isRejected ? <FaTimesCircle /> : (step.completed ? '✓' : '')}
                            </div>
                            <span className={`step-name ${step.current ? 'font-bold text-fc800a' : ''}`}>
                                {step.name}
                                {/* You can add details for current step, e.g., "Today", "Upcoming" */}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Conditional Actions based on Status */}
                {isFeeDue && (
                    <div className="upload-section mt-8">
                        <p className="text-lg font-semibold text-orange-600 mb-4">Your application is awaiting first fee payment.</p>
                        <button
                            onClick={handleFirstFeePayment}
                            className={`upload-button ${isPayingFee ? 'loading-button' : ''}`}
                            disabled={isPayingFee}
                        >
                            {isPayingFee ? <FaSpinner className="animate-spin mr-2" /> : ''}
                            {isPayingFee ? 'Processing Payment...' : 'Pay First Fee'}
                        </button>
                    </div>
                )}

                {isRejected && (
                    <div className="text-center mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        <p className="font-semibold text-xl mb-2">Application Rejected</p>
                        <p>Unfortunately, your application has been rejected. Please contact support for more details.</p>
                    </div>
                )}

                {/* Document Upload Section (always visible or conditional based on needs) */}
                <div className="upload-section mt-8 border-t pt-8 border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-center">Upload Supporting Documents</h2>
                    <button onClick={handleUploadClick} className="upload-button flex items-center justify-center mx-auto">
                        <FaCloudUploadAlt className="mr-2" /> Upload Document
                    </button>
                    {uploadedFileName && (
                        <p className="uploaded-file mt-2">Selected: {uploadedFileName}</p>
                    )}
                    {uploadMessage && (
                        <p className={`mt-2 text-sm ${uploadError ? 'text-red-600' : 'text-green-600'}`}>{uploadMessage}</p>
                    )}
                    {uploadError && (
                        <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        aria-label="Upload Document"
                    />
                </div>
            </section>

            {/* Example of how you might call other API functions (e.g., from an admin dashboard) */}
            {/* <button onClick={() => submitCourseApplication(1, 2, 3, "1000")}>Submit Test Application</button> */}
            {/* <button onClick={() => updateSchedule('2025-07-20T10:00:00Z')}>Update Interview</button> */}
            {/* <button onClick={() => updateApplicationStatus('Approved')}>Approve Application</button> */}
            {/* <button onClick={() => updateApplicationStatus('Rejected')}>Reject Application</button> */}

        </main>
    );
}