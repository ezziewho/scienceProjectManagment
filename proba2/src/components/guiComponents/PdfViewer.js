import React from "react";
import { Button, Container } from "react-bootstrap";

const PdfViewer = ({ filePath, title }) => {
    return (
        <Container className="text-center mt-3">
            <h3>{title}</h3>
            <p>You can download or open the document in a new tab.</p>

            {/* 📄 Pobranie pliku PDF */}
            <Button variant="primary" href={filePath} download className="m-2">
                📥 Download PDF
            </Button>

            {/* 🔗 Otworzenie PDF w nowej karcie */}
            <Button variant="secondary" href={filePath} target="_blank" rel="noopener noreferrer" className="m-2">
                📄 Open PDF in New Tab
            </Button>
        </Container>
    );
};

export default PdfViewer;
