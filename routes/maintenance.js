const Router = require('express-promise-router')
const client = require('../db')
const path = require('path');
const maintenanceRouter = new Router()
const basicRedirect = require('./basicRedirect')
var QRCode = require('qrcode');

module.exports = maintenanceRouter

maintenanceRouter.get("/aform",async(req,res,next) =>{
  if(req.session.email){
    res.sendFile(path.resolve('public/add_maintenance_form.html'));
  }
  else{
    basicRedirect(res,next,"/login/form")
  }
});


maintenanceRouter.post('/add',async(req,res,next)=>{
  const id = req.body.id;
  const eid = req.body.eid;
  const date = req.body.date;
  const remarks = req.body.remarks;
  
  client.query("INSERT INTO maintenance(equipmentid,technicianid,maintenance_date,remarks) VALUES ($1, $2, $3, $4);", [eid,id,date,remarks]);
  basicRedirect(res,next,"/home");
  res.end();
  next();
});


maintenanceRouter.get("/",async(req,res,next) =>{
  if(req.session.email){
    res.sendFile(path.resolve('public/maintenance_history.html'));
  }
  else{
    basicRedirect(res,next,"/login/form")
  }
});


maintenanceRouter.get('/:id',async(req,res,next)=>{
  const {rows} = await client.query("SELECT maintenance.equipmentid equipmentid, maintenance.technicianid technicianid, maintenance.maintenance_date date, maintenance.remarks remarks, technician.name technician_name, equipment.name equipment_name FROM maintenance INNER JOIN equipment ON maintenance.equipmentid=equipment.id INNER JOIN technician ON maintenance.technicianid=technician.id WHERE maintenance.equipmentid=$1;", [req.params.id]);
  console.log(rows);
  res.json(rows);
  next();

})

maintenanceRouter.post('/request',async(req,res,next)=>{
  const name = req.body.name;
  const cost = req.body.cost;
  const quantity = req.body.quantity;
  const godownid = req.session.godownid;
  const companyid = req.session.companyid;
  
  client.query("INSERT INTO maintenance_req(name,cost,quantity,godownid,companyid) VALUES ($1, $2, $3, $4, $5);", [name, cost, quantity, godownid, companyid]);
  QRCode.toDataURL(`Name:${name},Cost:${cost}`, function (err, url) {
    saveUrl(req,url);
  })
  basicRedirect(res,next,"/home");
  res.end();
  next();
});