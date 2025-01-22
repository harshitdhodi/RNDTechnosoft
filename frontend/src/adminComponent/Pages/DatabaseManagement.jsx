import React,{useState,useEffect} from 'react';
import axios from "axios"

export default function DatabaseManagement() {

  const [backups, setBackups] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [month1, setMonth1] = useState('');
  const [month2, setMonth2] = useState('');
  const [month3, setMonth3] = useState('');
  const [record1,setRecord1]=useState('')
  const [record2,setRecord2]=useState('')
  const [record3,setRecord3]=useState('')
  


  useEffect(() => {
    const fetchBackups = async () => {
        try {
            const response = await axios.get('/api/backup/getData',{withCredentials: true});
        
            setBackups(response.data);
            
            // Extract fileNames from the fetched backups
            const extractedFileNames = response.data.map(backup => backup.fileName);
            setFileNames(extractedFileNames);

            // Set the file names for the last 3 months
            if (extractedFileNames.length) {
                setMonth1(extractedFileNames[extractedFileNames.length - 1]);
                setMonth2(extractedFileNames[extractedFileNames.length - 2]);
                setMonth3(extractedFileNames[extractedFileNames.length - 3]);
            }
        } catch (error) {
            console.error('Error fetching backups:', error);
        }
    };


    fetchBackups();
}, []);

useEffect(() => {
  const extractMonthAndYear = (fileName) => {
      if (typeof fileName === 'string') {
          const parts = fileName.split('_'); // Split the file name by underscores
          const month = parts[1]; // The month is the second part after splitting
          const year = parts[2]; // The year is the third part after splitting
          return { month, year };
      } else {
          return fileName; // If it's already an object, return it as is
      }
  };

  

  // Example file name format: export_June_2024_timestamp.json
  if (month1) {
      const { month, year } = extractMonthAndYear(month1);
      setRecord1({ month, year });
  }
  if (month2) {
      const { month, year } = extractMonthAndYear(month2);
      setRecord2({ month, year });
    
  }
  if (month3) {
      const { month, year } = extractMonthAndYear(month3);
      setRecord3({ month, year });
  
  }
}, [month1, month2, month3]);


  const handleExport = async () => {
    try {
        const response = await axios.get('/api/backup/export-data', {
            responseType: 'blob',
            withCredentials: true
        });

      
        const fileName = response.headers['x-filename'];
        if (!fileName) {
            throw new Error('Filename not found in headers');
        }

    

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
    } catch (error) {
        console.error('Error exporting data:', error);
    }
};

const handleDelete = async () => {
  try {
      await axios.delete('/api/backup/deleteData', { withCredentials: true });
      alert('All data deleted successfully');
  } catch (error) {
      console.error('Error deleting data:', error);
      alert('Failed to delete data');
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center  p-4">
      <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase mb-8">Database Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
        <div className="bg-red-500 text-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">Delete All Data</h2>
          <button className="bg-white text-red-500 px-4 py-2 rounded hover:bg-red-200" onClick={handleDelete}>
            Delete
          </button>
        </div>
        <div className="bg-blue-500 text-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">Download All Data</h2>
          <button className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-blue-200" onClick={handleExport}>
            Download
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl mt-8">
      <div className="bg-green-500 text-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
       { month1 ? <h2 className="text-xl font-semibold mb-4">{record1.month} {record1.year} Backup</h2> : <h2 className="text-xl font-semibold mb-4">Backup file Not Available</h2>}
        <button className="bg-white text-green-500 px-4 py-2 rounded hover:bg-green-200">
          <a href={`/api/backup/download/${month1}`} download >Download</a>
        </button>
      </div>
      <div className="bg-yellow-500 text-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">  
        {month2 ? <h2 className="text-xl font-semibold mb-4">{record2.month} {record2.year} Backup</h2>:<h2 className="text-xl font-semibold mb-4">Backup file Not Available</h2> }
        <button className="bg-white text-yellow-500 px-4 py-2 rounded hover:bg-yellow-200">
        <a href={`/api/backup/download/${month2}`} download>Download</a>

        </button>
      </div>
      <div className="bg-purple-500 text-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
        {month3 ? <h2 className="text-xl font-semibold mb-4">{record3.month} {record3.year} Backup</h2>: <h2 className="text-xl font-semibold mb-4">Backup file Not Available</h2>}
        <button className="bg-white text-purple-500 px-4 py-2 rounded hover:bg-purple-200">
        <a href={`/api/backup/download/${month3}`} download >Download</a>
        </button>
      </div>

      </div>
     
    </div>
  );
}
