import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import React from 'react';
import { styled } from '@mui/material/styles';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';

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
    title: any;
    isHospDtls:any;
    body?:any;
  }
const Model = ({opeModel, setOpeModel, title,isHospDtls,body}: Props) => {
    const [open, setOpen] = React.useState(opeModel);
    const hospitalNameMail =  title.replace(/ /g, '')

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
       {title}
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
        {isHospDtls ?
        (<Typography gutterBottom>
          <div style = {{display: "flex"}}><PhoneInTalkIcon/>   Contact : 044 - 23143532,  044-23139232<br/></div>
          <div style = {{display: "flex"}}> <MailOutlineIcon/>   Email: {hospitalNameMail}@gmail.com</div>
        </Typography>) :
        (<div>{body}</div>)
        } 
      </DialogContent>
     </BootstrapDialog>
  </React.Fragment>
)
}
export default Model;