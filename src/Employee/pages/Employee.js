import React, { useState, useEffect } from 'react'
import EmployeeForm from "../components/EmployeeForm";
import Nav from "../../Home/components/Nav"

import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from "../components/useTable";

import Controls from "../pages/controls/Controls";
import { Search } from "@material-ui/icons";
import axios from "../../config/axiosconfig"
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    searchInput: {
        width: '75%'
    }
}))


const headCells = [
    { id: 'name', label: 'Employee Name' },
    { id: 'email', label: 'Email Address (Personal)' },
    { id: 'mobile', label: 'Mobile Number' },
    { id: 'department', label: 'Department'},
    {id:"delete", label:"Delete"}
]

export default function Employees() {


    const classes = useStyles();

    const url = 'http://localhost:5000/manager/employees'

    const [records, setRecords] = useState([])
    const [open, setOpen] = useState(false)
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  
    useEffect(() => {
        getData()
        setOpen(false)
    }, [])

    const getData = () => {
        axios.get(url, {withCredentials:true})
        .then((response)=>{
          setRecords(response.data)
        })

    }

    const handleDelete = (id,e) => {
       console.log(id,e)
       axios.delete(url, {data : {id}}).then(() => getData(),
       setOpen(true)

       )
       

    }
    
    const handleClose = (event, reason) => {
        if(reason ==="clickaway") {
            return
          }
          setOpen(false)
      }
      
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(x => x.name.toLowerCase().includes(target.value))
            }
        })
    }

    return (
        <>
            <Nav />
            <Paper className={classes.pageContent}>    
                <EmployeeForm /> 
                <Toolbar>
                <Search />
                    
                    <Controls.Input data-testid ="search"
                        label="Search Employees"
                        className={classes.searchInput}
                        InputProps={{
                            
                            startAdornment: ( <InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                </Toolbar>
                </Paper>
                <Paper className = {classes.pageContent}>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                        recordsAfterPagingAndSorting().map(item =>
                            (<TableRow key={item._id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                    
                                <TableCell>{item.mobile}</TableCell>
                                <TableCell>{item.department}</TableCell>
                                <TableCell>
                                <IconButton onClick={(e) => handleDelete(item._id, e)}>
                                    <DeleteIcon/>
                                </IconButton>

                                    
                                </TableCell>
                                </TableRow>)
                            )
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
                <Snackbar
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                    }}
                    open={open} autoHideDuration={6000} onClose={handleClose}>
                    <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="info">
                        Employee Deleted!
                    </MuiAlert>
                </Snackbar>
            </Paper>
        </>
    )
}