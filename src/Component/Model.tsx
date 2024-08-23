import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme:any }) => ({
    '& .MuiDialogContent-root': {
      padding: "50px",
    },
    '& .MuiDialogActions-root': {
      padding: "50px",
    },
  }));

  interface Props {
    opeModel: any;
    setOpeModel: any;
    hospitalDetails: any;
  }
const Model = ({opeModel, setOpeModel, hospitalDetails}: Props) => {
    const [open, setOpen] = React.useState(opeModel);

    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
      setOpeModel(false)
    };
    
return(
    <React.Fragment>
        <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      PaperProps={{
        style: {
            backgroundColor: 'lightblue',
          boxShadow: 'none',
        },
      }}
      BackdropProps={{
        style: {
          backgroundColor: 'transparent', // Makes the backdrop (behind the modal) transparent
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold'}} id="customized-dialog-title">
       {hospitalDetails}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>
          Contact : 044 - 23143532 <br/>
044-23139232
Email: {hospitalDetails} @gmail.com
        </Typography>
      </DialogContent>
     </BootstrapDialog>
  </React.Fragment>
)
}
export default Model;