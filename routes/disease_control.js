const Disease = require('../models/disease');
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
const upload = multer({ dest: uploadsDir }, {ext:['.jpg', '.jpeg', '.png', '.img']});

router.post('/generate-report', upload.single('image'), async (req, res) => {
    const data = req.body;
    const object = data


    // if (!body) {
    //     return res.status(400).send({ status: 'Error', msg: 'No data was passed' });
    // }

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
                {
                    logger: m => console.log(m) // Optional logger to see progress
                }
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
        // Create a document
        const doc = new PDFDocument();
        const pdfPath = path.join(pdfDir, `disease_report_${date}_${time}.pdf`);
    
         


        // Create a write stream
        const writeStream = fs.createWriteStream(pdfPath);

        // Pipe the PDF document to the write stream
        doc.pipe(writeStream);

        // Register Roboto fonts
        doc.registerFont('Roboto', 'fonts/Roboto-Regular.ttf');
        doc.registerFont('Roboto-Bold', 'fonts/Roboto-Bold.ttf');

        // Sample data (Replace with actual data from the form)
        const info = {
            reportingAuthority: {
                'surname': object['reportingAuthority.surname'],
                'otherNames': object['reportingAuthority.otherNames']
            },
            notifier: {
                'type': object['notifier.type'],
                'reportingSource': object['notifier.reportingSource'],
                'organization': object['notifier.organization'],
                'dateReported': object['notifier.dateReported'],
                'usualGP': object['notifier.usualGP'],
                'gpPractice': object['notifier.gpPractice'],
                'gpPracticeAddress': {
                    'no': object['notifier.gpPracticeAddress.no'],
                    'street': object['notifier.gpPracticeAddress.street'],
                    'lga': object['notifier.gpPracticeAddress.lga'],
                    'townCity': object['notifier.gpPracticeAddress.townCity'],
                    'postCode': object['notifier.gpPracticeAddress.postCode'],
                    'geoCode': object['notifier.gpPracticeAddress.geoCode']
                }
            },
            caseIdentification: {
                'surname': object['caseIdentification.surname'],
                'otherNames': object['caseIdentification.otherNames'],
                'email': object['caseIdentification.email'],
                'currentAddress': {
                    'no': object['caseIdentification.currentAddress.no'],
                    'street': object['caseIdentification.currentAddress.street'],
                    'suburb': object['caseIdentification.currentAddress.suburb'],
                    'townCity': object['caseIdentification.currentAddress.townCity'],
                    'postCode': object['caseIdentification.currentAddress.postCode'],
                    'geoCode': object['caseIdentification.currentAddress.geoCode']
                },
                'phone': {
                    'home': object['caseIdentification.phone.home'],
                    'work': object['caseIdentification.phone.work']
                }
            },
            caseDemography: {
                'dateOfBirth': object['caseDemography.dateOfBirth'],
                'sex': object['caseDemography.sex'],
                'occupation': object['caseDemography.occupation'],
                'workspace': object['caseDemography.workspace'],
                'currentAddress': {
                    'no': object['caseDemography.currentAddress.no'],
                    'street': object['caseDemography.currentAddress.street'],
                    'suburb': object['caseDemography.currentAddress.suburb'],
                    'townCity': object['caseDemography.currentAddress.townCity'],
                    'postCode': object['caseDemography.currentAddress.postCode'],
                    'geoCode': object['caseDemography.currentAddress.geoCode']
                },
                'phone': {
                    'home': object['caseDemography.phone.home'],
                    'work': object['caseDemography.phone.work']
                }
            },
            ethnic: {
                'type': Array.isArray(object['ethnic.type']) ? object['ethnic.type'].join(', ') : object['ethnic.type']
            }
        };


        // // Create new data document
        // const disease = new Disease();

        // // Assign values from info object to disease document
        // disease.reportingAuthority = {
        //     surname: info.reportingAuthority.surname,
        //     otherNames: info.reportingAuthority.otherNames
        // };

        // disease.notifier = {
        //     type: info.notifier.type,
        //     reportingSource: info.notifier.reportingSource,
        //     organization: info.notifier.organization,
        //     dateReported: info.notifier.dateReported,
        //     usualGP: info.notifier.usualGP,
        //     gpPractice: info.notifier.gpPractice,
        //     gpPracticeAddress: {
        //         no: info.notifier.gpPracticeAddress.no,
        //         street: info.notifier.gpPracticeAddress.street,
        //         lga: info.notifier.gpPracticeAddress.lga,
        //         townCity: info.notifier.gpPracticeAddress.townCity,
        //         postCode: info.notifier.gpPracticeAddress.postCode,
        //         geoCode: info.notifier.gpPracticeAddress.geoCode
        //     }
        // };

        // disease.caseIdentification = {
        //     surname: info.caseIdentification.surname,
        //     otherNames: info.caseIdentification.otherNames,
        //     email: info.caseIdentification.email,
        //     currentAddress: {
        //         no: info.caseIdentification.currentAddress.no,
        //         street: info.caseIdentification.currentAddress.street,
        //         suburb: info.caseIdentification.currentAddress.suburb,
        //         townCity: info.caseIdentification.currentAddress.townCity,
        //         postCode: info.caseIdentification.currentAddress.postCode,
        //         geoCode: info.caseIdentification.currentAddress.geoCode
        //     },
        //     phone: {
        //         home: info.caseIdentification.phone.home,
        //         work: info.caseIdentification.phone.work
        //     }
        // };

        // disease.caseDemography = {
        //     dateOfBirth: info.caseDemography.dateOfBirth,
        //     sex: info.caseDemography.sex,
        //     occupation: info.caseDemography.occupation,
        //     workspace: info.caseDemography.workspace,
        //     currentAddress: {
        //         no: info.caseDemography.currentAddress.no,
        //         street: info.caseDemography.currentAddress.street,
        //         suburb: info.caseDemography.currentAddress.suburb,
        //         townCity: info.caseDemography.currentAddress.townCity,
        //         postCode: info.caseDemography.currentAddress.postCode,
        //         geoCode: info.caseDemography.currentAddress.geoCode
        //     },
        //     phone: {
        //         home: info.caseDemography.phone.home,
        //         work: info.caseDemography.phone.work
        //     }
        // };

        // disease.ethnic = {
        //     type: info.ethnic.type
        // };

        // // Save the document to MongoDB
        // await disease.save();

        // Set the font and styles
        doc.font('Roboto-Bold').fontSize(24).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 35).fill().fillColor('black').text('Disease Case Report Portal', { align: 'center' });
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
                .text(` ${content}`, { align: 'right' })
                .moveDown(0.5);
        }

        // Reporting Authority
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('REPORTING AUTHORITY', { align: 'left' });
        doc.moveDown(0.5);
        addLabelContent('Name of Health Officer Responsible for case', `${info.reportingAuthority.surname}, ${info.reportingAuthority.otherNames}`);

        doc.moveDown(1.7);

        // Notifier Identification
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('NOTIFIER IDENTIFICATION', { align: 'left' });
        doc.moveDown(0.5);
        addLabelContent('Notifier Type', info.notifier.type);
        addLabelContent('Reporting Source', info.notifier.reportingSource);
        addLabelContent('Organization', info.notifier.organization);
        addLabelContent('Date Reported', info.notifier.dateReported);
        addLabelContent('Usual GP', info.notifier.usualGP);
        addLabelContent('GP Practice', info.notifier.gpPractice);

        doc.moveDown(1.7);

        // GP Practice Address
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('GP PRACTICE ADDRESS', { align: 'left' });
        doc.moveDown(0.5);
        addLabelContent('No.', info.notifier.gpPracticeAddress.no);
        addLabelContent('Street', info.notifier.gpPracticeAddress.street);
        addLabelContent('LGA', info.notifier.gpPracticeAddress.lga);
        addLabelContent('Town/City', info.notifier.gpPracticeAddress.townCity);
        addLabelContent('Post Code', info.notifier.gpPracticeAddress.postCode);
        addLabelContent('Geo Code', info.notifier.gpPracticeAddress.geoCode);

        doc.moveDown(1.7);

        // Case Identification
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('CASE IDENTIFICATION', { align: 'left' });
        doc.moveDown(0.5);
        addLabelContent('Name', `${info.caseIdentification.surname}, ${info.caseIdentification.otherNames}`);
        addLabelContent('Email', info.caseIdentification.email);

        doc.moveDown(1.7);

        // Case Identification Address
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('CURRENT ADDRESS', { align: 'left' });
        doc.moveDown(0.5);
        addLabelContent('No.', info.caseIdentification.currentAddress.no);
        addLabelContent('Street', info.caseIdentification.currentAddress.street);
        addLabelContent('Suburb', info.caseIdentification.currentAddress.suburb);
        addLabelContent('Town/City', info.caseIdentification.currentAddress.townCity);
        addLabelContent('Post Code', info.caseIdentification.currentAddress.postCode);
        addLabelContent('Geo Code', info.caseIdentification.currentAddress.geoCode);
        addLabelContent('Home Phone', info.caseIdentification.phone.home);
        addLabelContent('Work Phone', info.caseIdentification.phone.work);

        doc.moveDown(1.7);

        // Case Demography
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('CASE DEMOGRAPHY', { align: 'left' });
        doc.moveDown(0.5);
        addLabelContent('Date of Birth', info.caseDemography.dateOfBirth);
        addLabelContent('Sex', info.caseDemography.sex);
        addLabelContent('Occupation', info.caseDemography.occupation);
        addLabelContent('Name of Workspace', info.caseDemography.workspace);

        doc.moveDown(1.7);

        // Case Demography Address
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('LOCATION', { align: 'left' });
        doc.moveDown(0.5);
        addLabelContent('No.', info.caseDemography.currentAddress.no);
        addLabelContent('Street', info.caseDemography.currentAddress.street);
        addLabelContent('Suburb', info.caseDemography.currentAddress.suburb);
        addLabelContent('Town/City', info.caseDemography.currentAddress.townCity);
        addLabelContent('Post Code', info.caseDemography.currentAddress.postCode);
        addLabelContent('Geo Code', info.caseDemography.currentAddress.geoCode);
        addLabelContent('Home Phone', info.caseDemography.phone.home);
        addLabelContent('Work Phone', info.caseDemography.phone.work);

        doc.moveDown(1.7);

        // Ethnic Groups
        doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('ETHNIC GROUP CASE BELONGS TO', { align: 'left' });
        doc.moveDown(0.5);
        addLabelContent('Ethnic Group', info.ethnic.type);


        // End the document
        doc.end();

        writeStream.on('error', (err) => {
            console.error(err);
            res.status(500).send('Error generating PDF');
        });

        writeStream.on('finish', () => {
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="disease_report_${date}_${time}.pdf"`);
        
            const readStream = fs.createReadStream(pdfPath);
            readStream.pipe(res);
        
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
        
      

    } catch (error) {
        console.error(error);
        // Sending error response if something goes wrong
        res.status(500).send({ status: "Error", msg: error.message });
    }
});

module.exports = router;
