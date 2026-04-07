require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const Project = require('./models/Project')
const Task = require('./models/Task')
const Notification = require('./models/Notification')
const Activity = require('./models/Activity')

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  // Clear existing data
  await Promise.all([
    User.deleteMany(),
    Project.deleteMany(),
    Task.deleteMany(),
    Notification.deleteMany(),
    Activity.deleteMany(),
  ])
  console.log('Cleared existing data')

  // Create users (passwords will be hashed by pre-save hook)
  const users = await User.create([
    { name: 'Alex Johnson',    email: 'admin@nexus.io',  password: 'Admin@123', role: 'admin', jobTitle: 'Project Manager',    department: 'Management',  phone: '+1 (555) 001-0001', color: 'bg-violet-500' },
    { name: 'Sarah Chen',      email: 'sarah@nexus.io',  password: 'User@123',  role: 'user',  jobTitle: 'Frontend Developer', department: 'Engineering', phone: '+1 (555) 002-0002', color: 'bg-blue-500' },
    { name: 'Marcus Williams', email: 'marcus@nexus.io', password: 'User@123',  role: 'user',  jobTitle: 'Backend Developer',  department: 'Engineering', phone: '+1 (555) 003-0003', color: 'bg-emerald-500' },
    { name: 'Emily Davis',     email: 'emily@nexus.io',  password: 'User@123',  role: 'user',  jobTitle: 'UI/UX Designer',     department: 'Design',      phone: '+1 (555) 004-0004', color: 'bg-amber-500' },
    { name: 'Ryan Park',       email: 'ryan@nexus.io',   password: 'User@123',  role: 'user',  jobTitle: 'QA Engineer',        department: 'Quality',     phone: '+1 (555) 005-0005', color: 'bg-rose-500' },
    { name: 'Lisa Thompson',   email: 'lisa@nexus.io',   password: 'User@123',  role: 'user',  jobTitle: 'DevOps Engineer',    department: 'Operations',  phone: '+1 (555) 006-0006', color: 'bg-cyan-500' },
  ])
  console.log(`Created ${users.length} users`)

  const [alex, sarah, marcus, emily, ryan, lisa] = users

  // Create projects
  const projects = await Project.create([
    { name: 'E-Commerce Platform',   description: 'Build a modern e-commerce platform with React and Node.js',          status: 'in-progress', priority: 'high',   progress: 65,  color: 'bg-violet-500',  dueDate: '2024-06-30', startDate: '2024-01-15', category: 'Web Development', members: [alex._id, sarah._id, marcus._id], createdBy: alex._id },
    { name: 'Mobile Banking App',    description: 'Develop a secure mobile banking application with biometric auth',     status: 'in-progress', priority: 'high',   progress: 40,  color: 'bg-blue-500',    dueDate: '2024-07-15', startDate: '2024-02-01', category: 'Mobile',          members: [sarah._id, emily._id, lisa._id],  createdBy: alex._id },
    { name: 'Healthcare Dashboard',  description: 'Analytics dashboard for healthcare professionals and patients',       status: 'planning',    priority: 'medium', progress: 20,  color: 'bg-emerald-500', dueDate: '2024-08-01', startDate: '2024-02-15', category: 'Analytics',       members: [alex._id, emily._id, ryan._id],   createdBy: alex._id },
    { name: 'Marketing Website',     description: 'Redesign company marketing website with new brand guidelines',        status: 'completed',   priority: 'low',    progress: 100, color: 'bg-amber-500',   dueDate: '2024-05-01', startDate: '2024-01-01', category: 'Web Development', members: [sarah._id, emily._id],            createdBy: alex._id },
    { name: 'AI Chatbot Integration',description: 'Integrate AI chatbot into customer support system',                   status: 'planning',    priority: 'medium', progress: 10,  color: 'bg-rose-500',    dueDate: '2024-09-01', startDate: '2024-03-01', category: 'AI/ML',           members: [marcus._id, ryan._id, lisa._id],  createdBy: alex._id },
    { name: 'Internal CRM Tool',     description: 'Custom CRM solution for the sales team efficiency',                   status: 'on-hold',     priority: 'low',    progress: 55,  color: 'bg-cyan-500',    dueDate: '2024-10-01', startDate: '2024-01-10', category: 'Internal Tools',  members: [alex._id, marcus._id],            createdBy: alex._id },
  ])
  console.log(`Created ${projects.length} projects`)

  const [ecom, banking, health, marketing, ai, crm] = projects

  // Create tasks
  const tasks = await Task.create([
    { title: 'Design System Setup',       description: 'Create and configure the core design system components and tokens',      status: 'done',        priority: 'high',   projectId: ecom._id,    assignee: emily._id,  dueDate: '2024-05-20', labels: ['design'],   createdBy: alex._id },
    { title: 'REST API Integration',      description: 'Integrate REST APIs for product listing, filtering and search',          status: 'in-progress', priority: 'high',   projectId: ecom._id,    assignee: marcus._id, dueDate: '2024-06-10', labels: ['backend'],  createdBy: alex._id },
    { title: 'Shopping Cart Feature',     description: 'Implement full shopping cart with persistent local storage',              status: 'in-progress', priority: 'medium', projectId: ecom._id,    assignee: sarah._id,  dueDate: '2024-06-15', labels: ['frontend'], createdBy: alex._id },
    { title: 'Payment Gateway',           description: 'Integrate Stripe payment processing and configure webhooks',              status: 'todo',        priority: 'high',   projectId: ecom._id,    assignee: marcus._id, dueDate: '2024-06-25', labels: ['backend'],  createdBy: alex._id },
    { title: 'Product Search & Filters',  description: 'Advanced search with multiple filter options and facets',                 status: 'todo',        priority: 'medium', projectId: ecom._id,    assignee: sarah._id,  dueDate: '2024-06-20', labels: ['frontend'], createdBy: alex._id },
    { title: 'Authentication Module',     description: 'JWT + biometric authentication system with refresh tokens',               status: 'done',        priority: 'high',   projectId: banking._id, assignee: marcus._id, dueDate: '2024-05-30', labels: ['security'], createdBy: alex._id },
    { title: 'Account Dashboard UI',      description: 'User account overview with balance and recent transactions',              status: 'in-progress', priority: 'medium', projectId: banking._id, assignee: sarah._id,  dueDate: '2024-06-20', labels: ['frontend'], createdBy: alex._id },
    { title: 'Transaction History',       description: 'Paginated transaction list with filters and CSV export',                  status: 'todo',        priority: 'medium', projectId: banking._id, assignee: emily._id,  dueDate: '2024-07-01', labels: ['frontend'], createdBy: alex._id },
    { title: 'Data Model Design',         description: 'Schema design for healthcare analytics data warehouse',                   status: 'in-progress', priority: 'high',   projectId: health._id,  assignee: marcus._id, dueDate: '2024-06-05', labels: ['database'], createdBy: alex._id },
    { title: 'Chart Components Library',  description: 'Reusable chart components: bar, line, pie and area charts',               status: 'todo',        priority: 'medium', projectId: health._id,  assignee: sarah._id,  dueDate: '2024-06-30', labels: ['frontend'], createdBy: alex._id },
    { title: 'AI Model Evaluation',       description: 'Evaluate and benchmark appropriate AI/LLM models for chatbot',            status: 'todo',        priority: 'high',   projectId: ai._id,      assignee: ryan._id,   dueDate: '2024-07-15', labels: ['ai'],       createdBy: alex._id },
    { title: 'Chat Interface Design',     description: 'Design conversational UI components and chatbot persona',                  status: 'todo',        priority: 'medium', projectId: ai._id,      assignee: emily._id,  dueDate: '2024-07-30', labels: ['design'],   createdBy: alex._id },
  ])
  console.log(`Created ${tasks.length} tasks`)

  // Create sample notifications for admin
  await Notification.create([
    { userId: alex._id, type: 'task',    message: 'Shopping Cart Feature is due in 3 days',       read: false },
    { userId: alex._id, type: 'member',  message: 'Marcus completed Authentication Module',        read: false },
    { userId: alex._id, type: 'project', message: 'Marketing Website marked as completed',         read: true  },
    { userId: alex._id, type: 'mention', message: 'Sarah mentioned you in a comment',              read: true  },
    { userId: alex._id, type: 'task',    message: 'Payment Gateway is overdue',                    read: false },
  ])

  // Create sample activities
  await Activity.create([
    { userId: marcus._id, action: 'completed task',    subject: 'Authentication Module', project: 'Mobile Banking App' },
    { userId: sarah._id,  action: 'updated task',      subject: 'Shopping Cart Feature', project: 'E-Commerce Platform' },
    { userId: emily._id,  action: 'created task',      subject: 'Chat Interface Design', project: 'AI Chatbot Integration' },
    { userId: alex._id,   action: 'completed project', subject: 'Marketing Website',     project: '' },
    { userId: ryan._id,   action: 'joined project',    subject: '',                      project: 'AI Chatbot Integration' },
    { userId: lisa._id,   action: 'created task',      subject: 'Transaction History',   project: 'Mobile Banking App' },
  ])

  console.log('Seed complete ✅')
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
