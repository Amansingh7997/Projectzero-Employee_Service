import { useState } from 'react'
import './App.css'
import { useTable,useGlobalFilter ,useSortBy} from 'react-table'
import * as React from 'react'
import axios from 'axios'

function App() {
  const [emp, setEmp] = useState([])
  const columns = React.useMemo(() => [
    { Header: "EmpId", accessor: "id" },
    { Header: "Name", accessor: "name" },
    { Header: "Department", accessor: "department" },
    { Header: "Role", accessor: "role" },
    { Header: "Edit", id:"edit",accessor: "edit" ,
      Cell:props=>(<button className='editBtn'onClick={()=>populateEmpdata(props.cell.row.original)}>Edit</button>)
    },
    { Header: "Delete", id:"delete",accessor: "delete" ,
      Cell:props=>(<button className='delBtn'onClick={()=>handleDelete(props.cell.row.original)}>Delete</button>)
    }    
  ], [])
  const [showcancel,setshowcancel]=useState(false);
  const handlecancel=()=>{
  setEmpData({name:"",department:"",role:""});
  setshowcancel(false);
}
  const data = React.useMemo(() =>emp,[]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow , setGlobalFilter,state } = useTable({ columns,data:emp },useGlobalFilter,useSortBy);
  const {globalFilter}=state;
  const [empData,setEmpData]=useState({name:"" ,department:"",role:""})
  const setChangedValue=(e)=>{
    setEmpData({...empData,[e.target.name]:e.target.value});
    console.log("empData::",empData)
  }
  const getEmployees=(e)=>{
    axios.get("http://127.0.0.1:8000/api/employees/").then((rs)=>{
      console.log(rs.data);
      setEmp(rs.data);

    })
  }
  const populateEmpdata=(emp)=>{
    setEmpData(emp);
    setshowcancel(true);
  }

 const addEditemp = async (e) => {
  e.preventDefault();
  if(empData.id){
    axios.put(`http://127.0.0.1:8000/api/employees/${empData.id}/`, empData).then((rs) => {
      console.log(rs.data);
  })}
  else{

  
  await axios.post("http://127.0.0.1:8000/api/employees/", empData).then((rs) => {
      console.log(rs.data);
    });
  }
        setEmpData({ name: "", department: "", role: "" }); // clear form
      getEmployees(); // refresh table
};

const handleDelete=async(emp)=>{
  const isConfirmed=window.confirm('Are you Sure you want to delete');
  if(isConfirmed){
  axios.delete(`http://127.0.0.1:8000/api/employees/${emp.id}/`, empData).then((rs) => {
      console.log(rs.data);
      setEmp(rs.data);
  })
}
  window.location.reload();
  }
  React.useEffect(()=>{
    getEmployees();
  },[]);
  return (
    <>
      <div className='empdev'>
        <h3>Full Stack with React, Python and MySQL</h3>
        <div className="addeditpn">
          <div className="addeditpndiv">
            <label htmlFor="name">Name: </label>
            <input className='addeditpndivinput'value={empData.name} onChange={setChangedValue} type="text" name='name' id='name' />
          </div>
          <div className="addeditpndiv">
            <label htmlFor="dep">Department: </label>
            <input className='addeditpndivinput'value={empData.department} onChange={setChangedValue} type="text" name='department' id='department' />
          </div>
          <div className="addeditpndiv">
            <label htmlFor="role">Role: </label>
            <input className='addeditpndivinput' value={empData.role} onChange={setChangedValue} type="text" name='role' id='role' />
          </div>
          <button className='addbutton' onClick={addEditemp}>{empData.id?"Update":"Add"}</button>
          <button className='cancelbutton' disabled={!showcancel} onClick={handlecancel}>Cancel</button>
        </div>
        <input type="search" name="insearch" value={globalFilter || ""} onChange={(e)=>setGlobalFilter(e.target.value)} className='insearch' id="insearch" placeholder='Search Employee here' />
        <table className="emptable" {...getTableProps()}>
          <thead>
            {headerGroups.map((hdg)=>(
            <tr {...hdg.getHeaderGroupProps()} key={hdg.id}>
                {hdg.headers.map((col)=>(
                  <th {...col.getHeaderProps(col.get)} key={col.id}>{col.render('Header')} </th>
                ))}
            </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row)=>{
              prepareRow(row);
              return (<tr{...row.getRowProps()} key = {rows.id}>
                    {row.cells.map((cell)=>(
                      <td {...cell.getCellProps()} key={cell.id}>{cell.render('Cell')}</td>
                    ))}
            </tr>)
            })}  
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
