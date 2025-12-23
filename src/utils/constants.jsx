export const ROLES = {
    STUDENT: 'student',
    INSTITUTION_SUPERVISOR: 'institutionSupervisor',
    INDUSTRY_SUPERVISOR: 'industrySupervisor',
    HOD: 'hod',
    COORDINATOR: 'siwesCoordinator',
};

export const ROLE_LABELS = {
    [ROLES.STUDENT]: 'Student',
    [ROLES.INSTITUTION_SUPERVISOR]: 'Institution Supervisor',
    [ROLES.INDUSTRY_SUPERVISOR]: 'Industry Supervisor',
    [ROLES.HOD]: 'Head of Department',
    [ROLES.COORDINATOR]: 'SIWES Coordinator',
};

export const LOGBOOK_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    NEEDS_REVIEW: 'NEEDS_REVIEW',
};

export const LOGBOOK_STATUS_COLORS = {
    [LOGBOOK_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
    [LOGBOOK_STATUS.APPROVED]: 'bg-green-100 text-green-800',
    [LOGBOOK_STATUS.NEEDS_REVIEW]: 'bg-red-100 text-red-800',
};

export const DEFENSE_VERDICT = {
    PENDING: 'PENDING',
    PASS: 'PASS',
    FAIL: 'FAIL',
};

export const DEFENSE_VERDICT_COLORS = {
    [DEFENSE_VERDICT.PENDING]: 'bg-yellow-100 text-yellow-800',
    [DEFENSE_VERDICT.PASS]: 'bg-green-100 text-green-800',
    [DEFENSE_VERDICT.FAIL]: 'bg-red-100 text-red-800',
};

export const WEEKS = Array.from({ length: 13 }, (_, i) => ({
    value: i + 1,
    label: `Week ${i + 1}`,
}));

export const DEPARTMENTS = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Business Administration',
    'Accounting',
    'Mass Communication',
    'Biochemistry',
    'Microbiology',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Economics',
    'Psychology',
];

export const NAV_ITEMS = {
    [ROLES.STUDENT]: [
        { label: 'Dashboard', path: '/dashboard', icon: 'Home' },
        { label: 'My Logbook', path: '/logbook', icon: 'Book' },
        { label: 'Submit Log', path: '/logbook/submit', icon: 'PlusCircle' },
        { label: 'My Defense', path: '/defense', icon: 'Shield' },
        { label: 'Profile', path: '/profile', icon: 'User' },
    ],
    [ROLES.INSTITUTION_SUPERVISOR]: [
        { label: 'Dashboard', path: '/dashboard', icon: 'Home' },
        { label: 'Assigned Students', path: '/students', icon: 'Users' },
        { label: 'Logbook Reviews', path: '/logbooks', icon: 'BookOpen' },
        { label: 'Reports', path: '/reports', icon: 'FileText' },
        { label: 'Profile', path: '/profile', icon: 'User' },
    ],
    [ROLES.HOD]: [
        { label: 'Dashboard', path: '/dashboard', icon: 'Home' },
        { label: 'Department Students', path: '/students', icon: 'Users' },
        { label: 'Assign Supervisors', path: '/assignments', icon: 'UserPlus' },
        { label: 'Reports', path: '/reports', icon: 'FileText' },
        { label: 'Profile', path: '/profile', icon: 'User' },
    ],
    [ROLES.COORDINATOR]: [
        { label: 'Dashboard', path: '/dashboard', icon: 'Home' },
        { label: 'All Students', path: '/students', icon: 'Users' },
        { label: 'Generate Codes', path: '/verification', icon: 'Key' },
        { label: 'Schedule Defense', path: '/defense/schedule', icon: 'Calendar' },
        { label: 'Grading', path: '/grading', icon: 'Award' },
        { label: 'Reports', path: '/reports', icon: 'FileText' },
        { label: 'Profile', path: '/profile', icon: 'User' },
    ],
};