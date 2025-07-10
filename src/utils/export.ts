import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { Event } from '../types';

export const exportToPDF = (events: Event[], title: string = 'Calendar Events') => {
  const pdf = new jsPDF();
  
  // Header
  pdf.setFontSize(20);
  pdf.text(title, 20, 30);
  
  pdf.setFontSize(12);
  pdf.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, 20, 45);
  
  // Events
  let yPosition = 65;
  const pageHeight = pdf.internal.pageSize.height;
  
  events.forEach((event, index) => {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 30;
    }
    
    pdf.setFontSize(14);
    pdf.text(`${index + 1}. ${event.title}`, 20, yPosition);
    
    pdf.setFontSize(10);
    yPosition += 15;
    pdf.text(`Date: ${format(event.date, 'MMMM d, yyyy')}`, 25, yPosition);
    
    if (event.category) {
      yPosition += 10;
      pdf.text(`Category: ${event.category}`, 25, yPosition);
    }
    
    if (event.country) {
      yPosition += 10;
      pdf.text(`Country: ${event.country}`, 25, yPosition);
    }
    
    if (event.description) {
      yPosition += 10;
      const splitDescription = pdf.splitTextToSize(event.description, 160);
      pdf.text(splitDescription, 25, yPosition);
      yPosition += splitDescription.length * 5;
    }
    
    yPosition += 15;
  });
  
  pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const exportToICS = (events: Event[], filename: string = 'calendar-events') => {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Calendar Archive//Calendar Events//EN',
    'CALSCALE:GREGORIAN'
  ];

  events.forEach(event => {
    const startDate = format(event.date, 'yyyyMMdd');
    const uid = `${event.id}@calendararchive.com`;
    
    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTART;VALUE=DATE:${startDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      `CATEGORIES:${event.category}`,
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};