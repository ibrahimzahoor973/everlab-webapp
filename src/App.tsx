import React, { useState } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Upload } from 'lucide-react';
import { HL7Data } from './types';

const columns: GridColDef[] = [
  {
    field: 'patientName',
    headerName: 'Patient Name',
    width: 150
  },
  {
    field: 'patientId',
    headerName: 'Patient ID',
    width: 130
  },
  {
    field: 'testName',
    headerName: 'Test Name',
    width: 200,
    renderCell: (params: GridRenderCellParams<HL7Data>) => (
      <div className="flex flex-col">
        <span>{params.row.testName}</span>
        <span className="text-xs text-gray-500">{params.row.diagnostic}</span>
      </div>
    )
  },
  {
    field: 'result',
    headerName: 'Result Standard',
    width: 120,
    renderCell: (params: GridRenderCellParams<HL7Data>) => (
      <div className={`flex items-center ${params.row.isAbnormal ? 'text-red-600 font-bold' : ''}`}>
        {params.value}
        <span className="ml-1">{params.row.unit}</span>
      </div>
    )
  },
  {
    field: 'standardRange',
    headerName: 'Standard Range',
    width: 150,
    renderCell: (params: GridRenderCellParams<HL7Data>) => (
      <div>
        {params.value} {params.row.unit}
      </div>
    )
  },
  {
    field: 'result1',
    headerName: 'Result Ever Lab',
    width: 120,
    renderCell: (params: GridRenderCellParams<HL7Data>) => (
      <div className={`flex items-center ${params.row.labAbnormal ? 'text-red-600 font-bold' : ''}`}>
        {params.row.result}
        <span className="ml-1">{params.row.unit}</span>
      </div>
    )
  },
  {
    field: 'everlabRange',
    headerName: 'Everlab Range',
    width: 150,
    renderCell: (params: GridRenderCellParams<HL7Data>) => (
      <div>
        {params.value} {params.row.unit}
      </div>
    )
  },
  {
    field: 'observationDate',
    headerName: 'Date',
    width: 180,
    valueFormatter: (params) => {
      if (!params.value) return '';
      try {
        const date = new Date(`${params.value.slice(0, 4)}-${params.value.slice(4, 6)}-${params.value.slice(6, 8)}`);
        return date.toLocaleDateString();
        console.log("🚀 ~ date:", date)
      } catch {
        return params.value;
      }
    }
  }
];

function App() {
  const [data, setData] = useState<HL7Data[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/parse-oru', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded successfully:', response.data);
      if(response.data) {
        const {data} = response.data;
        const dataObj = data.map((item: HL7Data) => {
          return {
            id: item._id,
            messageType: item.type || 'N/A',
            patientName: item.patientName || 'N/A',
            patientId: item.patientId || 'N/A',
            observationDate: item.date || '',
            testName: item.name || 'N/A',
            diagnostic: item.diagnostic || 'N/A',
            result: item.patientValue || 'N/A',
            unit: item.units || 'N/A',
            referenceRange: item.type || 'N/A',
            isAbnormal: item.abnormal || false,
            labAbnormal: item.labAbnormal || false,
            standardRange: `${item.standard_lower} - ${item.standard_higher}`,
            everlabRange: `${item.everlab_lower} - ${item.everlab_higher}`,
          }
        });
        setData(dataObj);
      }

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">HL7 Data Viewer</h1>
              <p className="text-gray-600 mt-1">Upload an ORU file to view pathology results</p>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
            >
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-500 mb-2" />
                <span className="text-sm text-gray-600">Upload ORU.txt file</span>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div style={{ height: 600 }}>
            <DataGrid
              rows={data}
              columns={columns}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
                sorting: {
                  sortModel: [{ field: 'isAbnormal', sort: 'desc' }],
                },
              }}
              disableRowSelectionOnClick
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;