const JobModel = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
// Get All Jobs
const getAllJobs = async (req, res) => {
  // only find jobs associated with currently logged in user by passing
  // user id
  const jobs = await JobModel.find({
    createdBy: req.user.userId,
  }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
// Get Single Job
const getJob = async (req, res) => {
  // get id from params
  const { id: jobId } = req.params;
  const { userId } = req.user;
  // find job by provided id and if its created by user which is currently logged in return job
  const job = await JobModel.findOne({ _id: jobId, createdBy: userId });
  // if job not found throw error
  if (!job) {
    throw new NotFoundError(`Cannot find job with id of ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
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
  const { userId } = req.user;
  const { id: jobId } = req.params;
  // get info from body
  const { company, position } = req.body;
  // check if fields is empty
  if (company === "" || position === "") {
    throw new BadRequestError("fields cannot be empty");
  }
  // find job and update with info from body
  const job = await JobModel.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  // if job not found throw error
  if (!job) {
    throw new NotFoundError(`Cannot find job with id of ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
// Delete job
const deleteJob = async (req, res) => {
  const { userId } = req.user;
  const { id: jobId } = req.params;
  // find job
  const job = await JobModel.findOneAndDelete({
    _id: jobId,
    createdBy: userId,
  });
  // if job not found throw error
  if (!job) {
    throw new NotFoundError(`Cannot find job with id of ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "deleted successfully" });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
