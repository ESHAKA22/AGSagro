import React, { useState } from 'react';
import axios from 'axios';
import './styles/RequestForm.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestForm = ({ fetchRequests, editData, customerId }) => {
    const [formData, setFormData] = useState(
        editData || {
            customerId: customerId ? String(customerId) : '', 
            customerName: '',
            companyName: '',
            machineType: '',
            machineModel: '',
            partName: '',
            partNumber: '',
            material: '',
            ManufactureYear: '',
            surfaceFinish: '',
            quantity: '',
            yourMessage: '',
            designFile: null,
        }
    );
    const [file, setFile] = useState(null);

    const isValidForm = () => {
        if (!formData.customerId.trim()) {
            toast.error('Customer ID is required.');
            return false;
        }

        if (!/^[a-zA-Z\s]+$/.test(formData.customerName)) {
            toast.error('Customer Name should only contain letters and spaces.');
            return false;
        }

        if (formData.quantity <= 0 || isNaN(formData.quantity)) {
            toast.error('Quantity must be a positive number.');
            return false;
        }

        if (!formData.ManufactureYear) {
            toast.error('Please select a valid Manufacture Year.');
            return false;
        }

        if (file && file.size > 50 * 1024 * 1024) {
            toast.error('File size must be less than 50MB.');
            return false;
        }

        const requiredFields = ['customerName', 'machineType', 'machineModel', 'partName', 'material'];
        for (const field of requiredFields) {
            if (!formData[field].trim()) {
                toast.error(`Please fill out the ${field.replace(/([A-Z])/g, ' $1')}.`);
                return false;
            }
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleYearChange = (date) => {
        setFormData({ ...formData, ManufactureYear: date.getFullYear().toString() });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            if (selectedFile.size <= 50 * 1024 * 1024) {
                setFile(selectedFile);
            } else {
                toast.error('File size must be less than 50MB.');
                setFile(null);
            }
        } else {
            toast.error('Please upload a valid PDF file.');
            setFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidForm()) {
            return;
        }

        const formDataToSubmit = new FormData();
        for (const key in formData) {
            formDataToSubmit.append(key, formData[key]);
        }
        if (file) {
            formDataToSubmit.append('designFile', file);
        }

        try {
            if (editData) {
                await axios.put(`http://localhost:8070/requests/${editData._id}`, formDataToSubmit, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success('Request updated successfully!');
            } else {
                await axios.post('http://localhost:8070/requests', formDataToSubmit, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success('Request created successfully!');
                
                sendPdfToCustomer(formData.customerId);
            }
            fetchRequests();
            setFormData({
                customerId: customerId ? String(customerId) : '', 
                customerName: '',
                companyName: '',
                machineType: '',
                machineModel: '',
                partName: '',
                partNumber: '',
                material: '',
                ManufactureYear: '',
                surfaceFinish: '',
                quantity: '',
                yourMessage: '',
                designFile: null,
            });
            setFile(null);
        } catch (error) {
            console.error('Error details:', error.response ? error.response.data : error.message);
            toast.error('There was an error processing your request.');
        }
    };

    const sendPdfToCustomer = async (customerId) => {
        try {
            await axios.post(`http://localhost:8070/send-pdf/${customerId}`);
            toast.success('PDF sent to the customer!');
        } catch (error) {
            console.error('Error sending PDF:', error);
            toast.error('Failed to send PDF to customer.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Customer ID:
                    <input
                        type="text"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Customer Name:
                    <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Company Name:
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Machine Type:
                    <input
                        type="text"
                        name="machineType"
                        value={formData.machineType}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Machine Model:
                    <input
                        type="text"
                        name="machineModel"
                        value={formData.machineModel}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Part Name:
                    <input
                        type="text"
                        name="partName"
                        value={formData.partName}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Part Number:
                    <input
                        type="text"
                        name="partNumber"
                        value={formData.partNumber}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Material:
                    <input
                        type="text"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <div>
                    <label>Manufacture Year:</label>
                    <DatePicker
                        selected={formData.ManufactureYear ? new Date(`${formData.ManufactureYear}-01-01`) : null}
                        onChange={handleYearChange}
                        showYearPicker
                        dateFormat="yyyy"
                        placeholderText="Select Manufacture Year"
                        required
                    />
                </div>
                <br />
                <label>
                    Surface Finish:
                    <input
                        type="text"
                        name="surfaceFinish"
                        value={formData.surfaceFinish}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Quantity:
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </label>
                <br />
                <label>
                    Your Message:
                    <textarea
                        name="yourMessage"
                        value={formData.yourMessage}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Design File (PDF only, max 5MB):
                    <input
                        type="file"
                        name="designFile"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />
                </label>
                <br />
                <button type="submit">{editData ? 'Update' : 'Create'} Request</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default RequestForm;
