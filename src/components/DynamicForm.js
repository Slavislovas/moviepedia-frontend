import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, CircularProgress } from '@mui/material';

const DynamicForm = ({ formFields, onSubmit, loading, initialFormData }) => {
  const [formData, setFormData] = useState(initialFormData || {});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Set initial form data when it changes
    setFormData(initialFormData || {});
  }, [initialFormData]);

  const validateField = (name, value) => {
    if (formFields.find((field) => field.name === name && field.validationRegex)) {
      const regex = new RegExp(formFields.find((field) => field.name === name).validationRegex);
      return !regex.test(value);
    }
    return false;
  };

  const handleChange = (e, name) => {
    const value = e.target.value;
  
    // Validate the field if a validation regex is provided
    const error = validateField(name, value);
    setFormErrors({
      ...formErrors,
      [name]: error,
    });
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || null, // Set to null if value is undefined
    }));
    console.log(formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submitting
    const newFormErrors = {};
    formFields.forEach((field) => {
      if (field.validationRegex) {
        const error = validateField(field.name, formData[field.name] || '');
        newFormErrors[field.name] = error;
      }
    });

    setFormErrors(newFormErrors);

    // Submit the form only if there are no errors
    if (!Object.values(newFormErrors).some((error) => error)) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {formFields.map((field, index) => (
          <Grid item xs={12} key={index}>
            {field.type === 'password' ? (
              <TextField
                fullWidth
                label={field.label}
                variant="outlined"
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(e, field.name)}
                error={formErrors[field.name]}
                helperText={formErrors[field.name] && field.title}
                required={field.required || false}
              />
            ) : field.type === 'date' ? (
              <TextField
                fullWidth
                label={field.label}
                variant="outlined"
                type="date"
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(e, field.name)}
                required={field.required || false}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  inputProps: {
                    max: field.max || '',
                  },
                }}
              />
            ) : (
              <TextField
                fullWidth
                label={field.label}
                variant="outlined"
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(e, field.name)}
                required={field.required || false}
                error={formErrors[field.name]}
                helperText={formErrors[field.name] && field.title}
              />
            )}
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default DynamicForm