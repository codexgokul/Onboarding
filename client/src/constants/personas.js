export const PERSONAS = [
  {
    id: 'hr_admin',
    name: 'Rachel Green',
    roleTitle: 'Senior HR Generalist',
    roleType: 'HR',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badge: 'HR Admin',
    description: 'Creates profiles, manages paperwork, and verifies compliance.'
  },
  {
    id: 'it_support',
    name: 'Marcus Shaw',
    roleTitle: 'IT Operations Lead',
    roleType: 'IT',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    badge: 'IT Admin',
    description: 'Provisions corporate emails, hardware, and manages tool licenses.'
  },
  {
    id: 'hiring_manager',
    name: 'Elena Rostova',
    roleTitle: 'Design Director',
    roleType: 'Manager',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    badge: 'Hiring Manager',
    description: 'Tracks team onboarding and conducts 30-day reviews.'
  },
  {
    id: 'new_hire_sarah',
    name: 'Sarah Jenkins',
    roleTitle: 'Senior Product Designer',
    roleType: 'Employee',
    employeeId: 'emp-001',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    badge: 'New Hire',
    description: 'Undergoing onboarding. Submits proof for task verification.'
  },
  {
    id: 'new_hire_david',
    name: 'David Chen',
    roleTitle: 'Full Stack Engineer',
    roleType: 'Employee',
    employeeId: 'emp-002',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    badge: 'New Hire',
    description: 'Starting in Engineering. Submits SSH key and setup proof.'
  }
];

export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Security',
  'HR',
  'Sales',
  'Marketing',
  'Finance',
  'Operations'
];

export const ONBOARDING_PHASES = [
  'Pre-boarding',
  'Day 1 Setup',
  'Week 1',
  'Month 1'
];
