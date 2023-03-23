const JobModel = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
// Get All Jobs
const getAllJobs = async (req, res) => {
  res.send("get all jobs");
};
// Get Single Job
const getJob = async (req, res) => {
  res.send("get single job");
};
// Create Job
const createJob = async (req, res) => {
  // add property of createdBy to req.body and use user id we get from auth middleware
  req.body.createdBy = req.user.userId;
  // create job
  const job = await JobModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
// Edit Job
const updateJob = async (req, res) => {
  res.send("update job");
};
// Delete job
const deleteJob = async (req, res) => {
  res.send("delete job");
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
