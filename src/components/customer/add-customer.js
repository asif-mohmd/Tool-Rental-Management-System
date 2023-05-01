import { useState, useEffect } from 'react';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Stack, Container, Typography, TextField, Checkbox, Alert, Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Compressor from 'compressorjs';

import FileUpload from 'react-material-file-upload';




export default function FullScreenDialog(details) {
 
 
  const [update, setUpdate] = useState(details.updated);
  const [files, setFiles] = useState([]);
  const [docs, setDocs] = useState([]);
  const [imgPreviews, setImgPreviews] = useState([]);
  
  const getBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let baseURL = '';
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };
  
  const handleFileChange = (event) => {
    setFiles(event);
    const fileObjs = event && event.length ? Array.from(event) : [];
    if (!fileObjs.length) {
      return;
    }
  
    const promises = fileObjs.map((fileObj) => {
      return new Promise((resolve, reject) => {
        new Compressor(fileObj, {
          quality: 0.6,
          success: (compressedResult) => {
            getBase64(compressedResult).then((result) => {
              resolve(result);
            }).catch((err) => {
              reject(err);
            });
          },
          error: (err) => {
            reject(err);
          },
        });
      });
    });
  
    Promise.all(promises).then((results) => {
      setImgPreviews((prevPreviews) => {
        return [...prevPreviews, ...results];
      });
      setDocs((prevDocs) => {
        return [...prevDocs, ...results];
      });
    }).catch((err) => {
      console.error(err);
    });
  };
  
 


  const validSchema = Yup.object().shape({
    CustomerName: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('Name is required'),
    Mobnum: Yup.string().matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits').required('Mobile number is required'),
    AltMobnum: Yup.string().matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
    Address: Yup.string().matches(/^\S/, 'Whitespace is not allowed'),
  });

  const [alertMsg, setAlert] = useState();
  const formik = useFormik({
    initialValues: {
      CustomerName: update ? details.data.name :'',
      Mobnum: update ? details.data.mobile : '',
      AltMobnum : update ? details.data.mobile : '',
      Address: update ? details.data.address : '',
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
     
      details.submit(values,doc)
     

    }
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  

  
  
  const alertTimeOut = () => {
    setTimeout(() => {
      setAlert();
    }, 2000);
  };
  const onclose = () => {
    formik.resetForm();
    details.onClose();
  };
 
  return (
    <div>
      <Dialog fullScreen open={details.open} onClose={details.onClose}>
        <AppBar sx={{ position: 'relative',background: '#5048E5' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onclose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {details.button} CUSTOMER
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              {details.button}
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">CUSTOMER DETAILS</Typography>
            
            {}
            <TextField
              fullWidth
              type="text"
              label="Customer Name"
              variant="outlined"
              {...getFieldProps('CustomerName')}
              error={Boolean(touched.CustomerName && errors.CustomerName)}
              helperText={touched.CustomerName && errors.CustomerName}
            />
            <TextField
           
           fullWidth
           type="text"
           label="Mobile Number"
           variant="outlined"
           value={details.update ? details.data.name : ''}
           {...getFieldProps('Mob num')}
           error={Boolean(touched.Mobnum && errors.Mobnum || alertMsg)}
           helperText={touched.Mobnum && errors.Mobnum || alertMsg}
         />
         <TextField
           
           fullWidth
           type="text"
           label="Alternative Number"
           variant="outlined"
           value={details.update ? details.data.name : ''}
           {...getFieldProps('AltMobnum')}
           error={Boolean(touched.AltMobnum && errors.AltMobnum || alertMsg)}
           helperText={touched.AltMobnum && errors.AltMobnum || alertMsg}
         />

         
         <Grid container spacing={0} >
  <Grid item xs={6} sm={6}> 
    <TextField
      fullWidth
      type="text"
      label="Care of name"
      variant="outlined"
      value={details.update ? details.data.name : ''}
      {...getFieldProps('Carename')}
      error={Boolean(touched.Carename && errors.Carename || alertMsg)}
      helperText={touched.Carename && errors.Carename || alertMsg}
    />
  </Grid>
  <Grid item xs={6} sm={6} style={{paddingLeft: '10px'}} >
    <TextField
      fullWidth
      type="text"
      label="Mobile Number"
      variant="outlined"
      value={details.update ? details.data.name : ''}
      {...getFieldProps('AltMobnum')}
      error={Boolean(touched.AltMobnum && errors.AltMobnum || alertMsg)}
      helperText={touched.AltMobnum && errors.AltMobnum || alertMsg}
    />
  </Grid>
</Grid>

            <TextField
              fullWidth
              type="text"
              label="Address"
              variant="outlined"
              {...getFieldProps('Address')}
              error={Boolean(touched.Address && errors.Address)}
              helperText={touched.Address && errors.Address}
            />
            
            {imgPreviews.map((preview, index) => {
      return (
        <img
          key={index}
          style={{width: 150, height: 150, objectFit: 'contain' ,cursor: "pointer"}}
          src={`${preview}`}
          role="presentation"
          alt="no network"
        />
      );
    })}
    <FileUpload accept="image/*" multiple value={files} onChange={handleFileChange} />
          
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
