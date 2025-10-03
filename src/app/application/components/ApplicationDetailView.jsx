import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Calendar, User, BookOpen, Clock, Edit } from "lucide-react";

export function ApplicationDetailView({ application, onClose }) {
    return (
        <div className="detail-view-overlay" onClick={onClose}>
            <Card className="detail-view-card" onClick={(e) => e.stopPropagation()}>
                <CardHeader>
                    <CardTitle className="detail-title">
                        <span>Application Details</span>
                        <X className="close-icon" onClick={onClose} />
                    </CardTitle>
                    <div className="detail-header-info">
                        <h3>{application.student_name}</h3>
                        <Badge className={`status-badge status-${application.status.toLowerCase()}`}>{application.status}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="detail-grid">
                        <div className="detail-item"><BookOpen size={16} /><strong>Course:</strong>{application.course_name}</div>
                        <div className="detail-item"><User size={16} /><strong>Teacher:</strong>{application.teacher_name}</div>
                        <div className="detail-item"><Calendar size={16} /><strong>Applied on:</strong>{new Date(application.application_date).toLocaleString()}</div>
                        <div className="detail-item"><Clock size={16} /><strong>Preferred Start:</strong>{new Date(application.start_date).toLocaleDateString()}</div>
                    </div>
                    <div className="notes-section">
                        <strong>Notes:</strong>
                        <p>{application.note || "No notes provided."}</p>
                    </div>
                </CardContent>
                <CardFooter className="detail-actions">
                    <button className="btn btn-custom-color"><Edit size={16} /> Update Status</button>
                    <button className="btn">Schedule Interview</button>
                </CardFooter>
            </Card>
        </div>
    );
}