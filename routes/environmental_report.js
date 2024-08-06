const Environment = require('../models/environment');
const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const multer = require('multer');
const Tesseract = require('tesseract.js');

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer for file uploads
const upload = multer({ dest: uploadsDir });

router.post('/generate-report', upload.single('image'), async (req, res) => {
    const data = req.body;
    const object = data;

    // Ensure the 'pdfs' directory exists
    const pdfDir = path.join(__dirname, '..', 'pdfs');
    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
    }

    let extractedText = '';

    if (req.file) {
        try {
            const result = await Tesseract.recognize(
                req.file.path,
                'eng',
                { logger: m => console.log(m) } // Optional logger to see progress
            );
            extractedText = result.data.text;
            fs.unlinkSync(req.file.path); // Delete the uploaded image after processing
        } catch (err) {
            return res.status(500).send('Error processing image');
        }
    }

    try {
        const time = moment().format('HH_mm_ss');
        const date = moment().format('YYYY-MM-DD');
        const filename = `environmental_report_${date}_${time}.pdf`;
        const pdfPath = path.join(pdfDir, filename);

        // Create a document
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(pdfPath);

        // Pipe the PDF document to the write stream
        doc.pipe(writeStream);

        // Register Roboto fonts
        doc.registerFont('Roboto', 'fonts/Roboto-Regular.ttf');
        doc.registerFont('Roboto-Bold', 'fonts/Roboto-Bold.ttf');

        // Sample data (Replace with actual data from the form)
        const info = {
            incidentDetails: {
                'date': object['incidentDetails.dateTime'],
                'location': object['incidentDetails.location'],
                'description': object['incidentDetails.description'],
                'witnesses': object['incidentDetails.witnesses']
            },
            'environmentalImpact': Array.isArray(object["environmentalImpact.categories"]) ? object["environmentalImpact.categories"].join(', ') : object["environmentalImpact.categories"],
            'incidentDescription': object["incidentDescription"],
            'actionsTaken': object["actionsTaken"],
            'reportedToAuthorities': object["reportingToAuthorities.reported"],
            'reportDetails': object["reporting"],
            'followUpActions': object["follow-up"],
            'preventiveMeasures': object["measures"],
            'additionalComments': object["comments"],
            'reportFiler': {
                'name': object["name-of-reporter"],
                'jobTitle': object["job-title"],
                'contactDetails': object["contact-details"]
            }
        };


        // Create new data document
        // const environment = new Environment();

        // // Assign values from info object to environment document
        // environment.incidentDetails = {
        //     date: info.incidentDetails.date,
        //     location: info.incidentDetails.location,
        //     description: info.incidentDetails.description,
        //     witnesses: Array.isArray(info.incidentDetails.witnesses) ? info.incidentDetails.witnesses : [info.incidentDetails.witnesses]
        // };

        // environment.environmentalImpact = Array.isArray(info.environmentalImpact) ? info.environmentalImpact.join(', ') : info.environmentalImpact;
        // environment.incidentDescription = info.incidentDescription;
        // environment.actionsTaken = info.actionsTaken;
        // environment.reportedToAuthorities = info.reportedToAuthorities;
        // environment.reportDetails = info.reportDetails;
        // environment.followUpActions = info.followUpActions;
        // environment.preventiveMeasures = info.preventiveMeasures;
        // environment.additionalComments = info.additionalComments;

        // environment.reportFiler = {
        //     name: info.reportFiler.name,
        //     jobTitle: info.reportFiler.jobTitle,
        //     contactDetails: info.reportFiler.contactDetails
        // };

        // // Save the document to MongoDB
        // try {
        //     await environment.save();
        //     console.log('Environment document saved successfully.');
        // } catch (error) {
        //     console.error('Error saving environment document:', error);
        // }

        // Set the font and styles
        doc.font('Roboto-Bold').fontSize(24).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 35).fill().fillColor('black').text('Environmental Incident Report Form', { align: 'center' });
        doc.moveDown();

        // Function to add a label and content
        function addLabelContent(label, content) {
            doc
                .font('Roboto-Bold')
                .fontSize(12.5)
                .fillColor('black')
                .text(`${label}:`, { continued: true });

            doc
                .font('Roboto')
                .fontSize(12)
                .fillColor('black')
                .text(` ${content}   `, { align: 'right' })
                .moveDown(0.5);
        }

        // Add incident details
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('INCIDENT DETAILS', { align: 'left' });
        doc.moveDown(0.5);
        addLabelContent('Date and time of the incident', info.incidentDetails.date);
        addLabelContent('Location of the incident', info.incidentDetails.location);
        addLabelContent('Describe the incident', info.incidentDetails.description);
        addLabelContent('Details of the witnesses, if any', info.incidentDetails.witnesses);

        doc.moveDown(1.7);

        // Environmental Impact
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('ENVIRONMENTAL IMPACT', { align: 'left' });
        doc.moveDown(0.5);
        addLabelContent('Category', info.environmentalImpact);

        doc.moveDown(1.7);

        // Description of the Incident
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('DESCRIPTION OF THE INCIDENT', { align: 'left' });
        doc.moveDown(0.5);
        doc.font('Roboto').fontSize(12).fillColor('black').text(info.incidentDescription).moveDown();

        doc.moveDown(1.7);

        // Immediate Actions Taken
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('IMMEDIATE ACTIONS TAKEN', { align: 'left' });
        doc.moveDown(0.5);
        doc.font('Roboto').fontSize(12).fillColor('black').text(info.actionsTaken).moveDown();

        doc.moveDown(1.7);

        // Reporting to Authorities
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('REPORTING TO AUTHORITIES', { align: 'left' });
        doc.moveDown(0.5);

        // Conditional logic to print report details based on the value of info.reportedToAuthorities
        doc.font('Roboto').fontSize(12).fillColor('black')
            // .text(`Reported: ${info.reportedToAuthorities}`)
            // .moveDown();

        if (info.reportedToAuthorities === 'YES') {
            doc.text(info.reportDetails).moveDown();
        } else {
            doc.text('The incident has not been reported to the appropriate authorities yet')
        }


        doc.moveDown(1.7);

        // Follow-up Actions
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('FOLLOW-UP ACTIONS', { align: 'left' });
        doc.moveDown(0.5);
        doc.font('Roboto').fontSize(12).fillColor('black').text(info.followUpActions).moveDown();

        doc.moveDown(1.7);

        // Preventive Measures
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('PREVENTIVE MEASURES', { align: 'left' });
        doc.moveDown(0.5);
        doc.font('Roboto').fontSize(12).fillColor('black').text(info.preventiveMeasures).moveDown();

        doc.moveDown(1.9);

        // Additional Comments
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('ADDITIONAL COMMENTS', { align: 'left' });
        doc.moveDown(0.5);
        doc.font('Roboto').fontSize(12).fillColor('black').text(info.additionalComments).moveDown();

        doc.moveDown(1.7);

        // Report Filer
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('REPORT FILER', { align: 'left' });
        doc.moveDown(0.5);
        addLabelContent('Name', info.reportFiler.name);
        addLabelContent('Job Title / Role', info.reportFiler.jobTitle);
        addLabelContent('Contact Details', info.reportFiler.contactDetails);

        // End the document
        doc.end();

        // Handle file stream errors
        writeStream.on('error', (err) => {
            console.error('Error writing PDF:', err);
            return res.status(500).send('Error generating PDF');
        });

        // Once the write stream finishes
        writeStream.on('finish', () => {
            // Check if file exists before sending
            fs.access(pdfPath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.error('File not found:', err);
                    return res.status(404).send('File not found');
                }

                // Send the generated PDF file to the client
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

                // Create a read stream from the PDF file path
                const readStream = fs.createReadStream(pdfPath);

                // Pipe the PDF stream to the response
                readStream.pipe(res);

                // Handle any errors with the read stream
                readStream.on('error', (err) => {
                    console.error('Error reading PDF:', err);
                    res.status(500).send('Error generating PDF');
                });

                // Delete the file after sending
                res.on("finish", () => {
                    fs.unlink(pdfPath, (err) => {
                        if (err) {
                            console.error('Error deleting PDF file:', err);
                        }
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).send({ status: "Error", msg: error.message });
    }
});

module.exports = router;
