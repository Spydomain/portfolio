export function generateAndOpenResumePDF() {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;
    const margin = 40;
    const lineHeight = 16;

    function addSectionHeader(text, yPos) {
      if (yPos > doc.internal.pageSize.getHeight() - 50) {
        doc.addPage();
        yPos = margin + 20;
      } else if (yPos > margin + 20) {
        yPos += 10;
      }
      
      doc.setFillColor(41, 82, 143);
      doc.rect(margin, yPos - 12, pageWidth - 2 * margin, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(text, margin + 8, yPos + 2);
      return yPos + 30;
    }

    function addText(text, x, yPos, options = {}) {
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      
      if (yPos > doc.internal.pageSize.getHeight() - 100) {
        doc.addPage();
        yPos = margin + 20; 
      }
      
      const maxWidth = pageWidth - (2 * margin);
      const splitText = doc.splitTextToSize(text, maxWidth);
      
      splitText.forEach((line, i) => {
        if (yPos > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          yPos = margin + 20;
        }
        doc.text(line, x, yPos, options);
        yPos += lineHeight;
      });
      
      return yPos;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('CURRICULUM VITAE', margin, y);
    y += 30;

    doc.setFontSize(14);
    doc.text('Bikash Sarraf', margin, y);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 255);
    doc.text('bikashsarraf83@gmail.com', pageWidth - margin - 200, y, { maxWidth: 200 });
    y += lineHeight;

    doc.setTextColor(0, 0, 0);
    y = addText('Chabahil, Kathmandu', margin, y);
    y += 20;

    y = addSectionHeader('EDUCATION', y);
    
    doc.setFontSize(11);
    y = addText('Bachelor\'s in Cyber Security and Ethical Hacking', margin, y);
    doc.setFont('helvetica', 'italic');
    doc.text('2024 - Present', pageWidth - margin - 120, y - lineHeight);
    doc.setFont('helvetica', 'normal');
    y = addText('Softwarica College of IT and E-Commerce, Gyaneshwor, Kathmandu Nepal', margin, y);
    y += 10;
    
    y = addText('+2 Science (Biology) - 3.08 GPA', margin, y);
    doc.setFont('helvetica', 'italic');
    doc.text('2022 - 2024', pageWidth - margin - 120, y - lineHeight);
    doc.setFont('helvetica', 'normal');
    y = addText('Xavier International College, Kalopul, Kathmandu Nepal', margin, y);
    y += 10;
    
    y = addText('SEE - 3.10 GPA', margin, y);
    doc.setFont('helvetica', 'italic');
    doc.text('2022', pageWidth - margin - 120, y - lineHeight);
    doc.setFont('helvetica', 'normal');
    y = addText('Shree Sharaswasti English Boarding School, Lipanimal-3, Bara Nepal', margin, y);
    y += 20;
    
    y = addSectionHeader('PROFESSIONAL EXPERIENCE', y);
    
    doc.setFont('helvetica', 'bold');
    y = addText('Currently no work experience', margin, y);
    y += 10;
    
    y = addSectionHeader('SKILLS', y);
    
    const skills = [
      '• Programming: Intermediate HTML, C, Python, CSS, Node.js, React.js, MySQL, Bash, PHP',
      '• Hacking: Practicing phishing, OSINT, session hacking, learning Pentesting & Bug Bounty',
      '• Languages: English, Nepali, and more'
    ];
    
    skills.forEach(skill => {
      y = addText(skill, margin, y);
    });
    y += 10;

    y = addSectionHeader('PROJECTS', y);
    
    const projects = [
      '1. Keylogger (Python)',
      '   • Created a keylogger using Python. GitHub: https://github.com/Spydomain/keylogger',
      '',
      '2. Bike Rental Nepal (Node.js + React.js)',
      '   • Frontend: https://github.com/Spydomain/front',
      '   • Backend: https://github.com/Spydomain/backend',
      '',
      '3. CVE-2023-22809 Automated Exploits (Python)',
      '   • https://github.com/Spydomain/CVE-2023-22809-automated-python-exploits',
      '',
      '4. ClipboardAI (Bash Script)',
      '   • https://github.com/Spydomain/ClipboardAI',
      '',
      '5. NebullaComms (Node.js+React.js)',
      '   • https://nebullacomms.netlify.app/',
      '',
      '6. NotesVista (Node.js+React.js)',
      '   • https://notesvista.netlify.app/'
    ];
    
    projects.forEach(project => {
      if (project.trim() === '') {
        y += lineHeight / 2;
      } else {
        y = addText(project, margin, y);
      }
    });
    y += 10;

    y = addSectionHeader('CERTIFICATIONS', y);
    
    const certifications = [
      '• TryHackMe Presecurity Certified',
      '• TryHackMe Cyber Security 101 Certified',
      '• TryHackMe Advent of Cyber 2022 Certified',
      '• TryHackMe Advent of Cyber 2023 Certified',
      '• TryHackMe Advent of Cyber 2024 Certified',
      '• Cisco Ethical Hacker Certified'
    ];
    
    certifications.forEach(cert => {
      y = addText(cert, margin, y);
    });
    y += 20;

    y = addSectionHeader('REFERENCES', y);
    
    doc.setFont('helvetica', 'bold');
    y = addText('currently no references', margin, y);
    doc.setFont('helvetica', 'normal');
    y += 10;
    
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      const ph = doc.internal.pageSize.getHeight();
      doc.text(`Page ${i} / ${pageCount}`, pageWidth - margin - 60, ph - 30);
    }

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    const newWindow = window.open('', '_blank');
    newWindow.location.href = pdfUrl;
    
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'Bikash_Sarraf_CV.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    return pdfUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
    throw error;
  }
}

window.generateAndOpenResumePDF = generateAndOpenResumePDF;
