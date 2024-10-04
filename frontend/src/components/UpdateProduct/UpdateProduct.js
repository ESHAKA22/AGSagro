import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; 
import { useFormik } from 'formik'; // Formik for form handling
import * as Yup from 'yup'; // Yup for validation
import './UpdateProduct.css'; // Import your custom CSS

const UpdateProduct = () => {
  const [productData, setProductData] = useState({
    P_name: '',
    Category: '',
    Manufacture: '',
    Price: '',
    Quantity: '',
    Description: '',
    Supplier_ID: '',
    P_Image: null
  });

  const [categories] = useState([
    'Engine Components', 'Transmission & Drivetrain', 'Hydraulic System',
    'Electrical System', 'Fuel System', 'Steering & Suspension', 'Brakes',
    'Cooling System', 'Exhaust System', 'Body & Cab Components', 'Tires & Wheels',
    'Filters & Maintenance Parts', 'Implements & Attachments', 'Safety & Accessories', 'Other'
  ]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/api/products/${id}`);
        setProductData(response.data.product);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
  }, [id]);

  // Formik setup with validation schema
  const formik = useFormik({
    initialValues: {
      P_name: productData.P_name || '',
      Category: productData.Category || '',
      Manufacture: productData.Manufacture || '',
      Price: productData.Price || '',
      Quantity: productData.Quantity || '',
      Description: productData.Description || '',
      Supplier_ID: productData.Supplier_ID || '',
      P_Image: productData.P_Image || null
    },
    enableReinitialize: true, // Ensure initial values update with productData
    validationSchema: Yup.object({
      P_name: Yup.string().required('Product Name is required'),
      Category: Yup.string().required('Category is required'),
      Manufacture: Yup.string().required('Manufacture is required'),
      Price: Yup.number().required('Price is required').positive('Price must be positive'),
      Quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
      Description: Yup.string().required('Description is required'),
      Supplier_ID: Yup.string().required('Supplier ID is required')
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('P_name', values.P_name);
      formData.append('Category', values.Category);
      formData.append('Manufacture', values.Manufacture);
      formData.append('Price', values.Price);
      formData.append('Quantity', values.Quantity);
      formData.append('Description', values.Description);
      formData.append('Supplier_ID', values.Supplier_ID);
      if (values.P_Image instanceof File) {
        formData.append('P_Image', values.P_Image);
      }

      try {
        const response = await axios.put(`http://localhost:8070/api/products/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Product updated successfully:', response.data);
        navigate('/ProductView');
      } catch (error) {
        console.error('Error updating product:', error.response.data);
      }
    }
  });

  return (
    <div className="container">
      <h2>Update Product</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="P_name"
            className="form-control"
            value={formik.values.P_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.P_name && formik.errors.P_name ? (
            <div className="error">{formik.errors.P_name}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="Category"
            className="form-control"
            value={formik.values.Category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {formik.touched.Category && formik.errors.Category ? (
            <div className="error">{formik.errors.Category}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label>Manufacture</label>
          <input
            type="text"
            name="Manufacture"
            className="form-control"
            value={formik.values.Manufacture}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.Manufacture && formik.errors.Manufacture ? (
            <div className="error">{formik.errors.Manufacture}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="Price"
            className="form-control"
            value={formik.values.Price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.Price && formik.errors.Price ? (
            <div className="error">{formik.errors.Price}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="Quantity"
            className="form-control"
            value={formik.values.Quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.Quantity && formik.errors.Quantity ? (
            <div className="error">{formik.errors.Quantity}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="Description"
            className="form-control"
            value={formik.values.Description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          ></textarea>
          {formik.touched.Description && formik.errors.Description ? (
            <div className="error">{formik.errors.Description}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label>Supplier ID</label>
          <input
            type="text"
            name="Supplier_ID"
            className="form-control"
            value={formik.values.Supplier_ID}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.Supplier_ID && formik.errors.Supplier_ID ? (
            <div className="error">{formik.errors.Supplier_ID}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label>Upload Image (optional)</label>
          <input
            type="file"
            name="P_Image"
            className="form-control"
            onChange={(e) => formik.setFieldValue('P_Image', e.target.files[0])}
          />
          {productData.P_Image && !(productData.P_Image instanceof File) && (
            <img src={productData.P_Image} alt={productData.P_name} style={{ maxHeight: '200px', marginTop: '10px' }} />
          )}
        </div>
        <button type="submit" className="btn btn-primary">Update Product</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
