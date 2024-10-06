import React, { useState } from 'react';
import axios from 'axios';
import './styles/RequestForm.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'; // Use js-cookie to handle cookies

const RequestForm = ({ fetchRequests, editData }) => {
    const customerId = Cookies.get('customerId');
    
    // Mapping of machine model numbers to machine types (real-world agricultural machinery)
    const machineModelMapping = {
        'JD 6175R': 'Tractor',
        'JD S780': 'Combine Harvester',
        'JD 9870 STS': 'Combine Harvester',
        'CIH Magnum 380': 'Tractor',
        'CIH Axial-Flow 8250': 'Combine Harvester',
        'NH CR9.90': 'Combine Harvester',
        'NH T8.435': 'Tractor',
        // Add more mappings as needed
    };

    // Mapping of part numbers to part names (real-world parts for agricultural machines)
    const partNumberMapping = {
        'R123456': 'Fuel Injector for John Deere 6175R',
        'AH216675': 'Grain Auger for John Deere S780',
        'AXE16692': 'Hydraulic Pump for John Deere 9870 STS',
        'ZTX16585': 'Rear Axle for Case IH Magnum 380',
        'T15871': 'Feeder Chain for Case IH Axial-Flow 8250',
        '84248397': 'Air Filter for New Holland CR9.90',
        '87301756': 'Transmission for New Holland T8.435',
        // Add more mappings as needed
    };

    // Predefined list of materials for the dropdown
    const materialOptions = [
        'Steel',
        'Aluminum',
        'Cast Iron',
        'Stainless Steel',
        'Bronze',
        'Plastic',
        'Rubber',
        'Composite',
        'Ceramic',
        // Add more materials as needed
    ];

    const [formData, setFormData] = useState(
        editData || {
            customerId: customerId ? String(customerId) : '', 
            customerName: '',
            companyName: '',
            machineModel: '',
            machineType: '',
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
        // Form validation logic
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
        const requiredFields = ['customerName', 'machineModel', 'machineType', 'partName', 'material'];
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

        setFormData((prevFormData) => {
            let updatedData = { ...prevFormData, [name]: value };

            // Auto-fill machine type when a known machine model is entered
            if (name === 'machineModel' && machineModelMapping[value]) {
                updatedData = { 
                    ...updatedData, 
                    machineType: machineModelMapping[value] 
                };
            }

            // Auto-fill part name when a known part number is entered
            if (name === 'partNumber' && partNumberMapping[value]) {
                updatedData = { 
                    ...updatedData, 
                    partName: partNumberMapping[value] 
                };
            }

            return updatedData;
        });
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
            }
            fetchRequests();  // Fetch the updated requests for both My Orders and Request List
            setFormData({
                customerId: customerId ? String(customerId) : '', 
                customerName: '',
                companyName: '',
                machineModel: '',
                machineType: '',
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
                    Part Number:
                    <input
                        type="text"
                        name="partNumber"
                        value={formData.partNumber}
                        onChange={handleChange}
                        onBlur={handleChange}  // Auto-fill when the user moves away from the field
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
                    Material:
                    <select
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Material</option>
                        {materialOptions.map((material, index) => (
                            <option key={index} value={material}>{material}</option>
                        ))}
                    </select>
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
                    Design File (PDF only, max 50MB):
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
