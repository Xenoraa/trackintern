import axiosInstance from './axios';

// Authentication Api
export const authAPI = {
    // Student signup with verification code
    studentSignup: (data) =>
        axiosInstance.post('/auth/student/signup', data),

    // Student login
    studentLogin: (data) =>
        axiosInstance.post('/auth/student/login', data),

    // Role login (supervisors, HOD, coordinator)
    roleLogin: (data) =>
        axiosInstance.post('/auth/role/login', data),

    // Verify token
    verifyToken: () =>
        axiosInstance.get('/auth/verify'),

    // Verify email with code
    verifyEmail: (data) =>
        axiosInstance.post('/auth/verify-email', data),

    // Register any role
    registerRole: (data) =>
        axiosInstance.post('/auth/role/register', data),
};

// Student Api
export const studentAPI = {
    // Get all students
    getAll: () =>
        axiosInstance.get('/students'),

    // Get student by ID
    getById: (id) =>
        axiosInstance.get(`/students/${id}`),

    // Create student (admin only)
    create: (data) =>
        axiosInstance.post('/students', data),

    // Update student
    update: (id, data) =>
        axiosInstance.put(`/students/${id}`, data),

    // Delete student
    delete: (id) =>
        axiosInstance.delete(`/students/${id}`),

    // Get student profile
    getProfile: () =>
        axiosInstance.get('/students/profile'),
};

// Logbook Api
export const logbookAPI = {
    // Create logbook entry
    createEntry: (data) =>
        axiosInstance.post('/logbook', data),

    // Get all logbooks
    getAll: () =>
        axiosInstance.get('/logbook'),

    // Get student's own logbook
    getMyLogbook: () =>
        axiosInstance.get('/logbook/my-logbook'),

    // Get specific student's logbook
    getStudentLogbook: (studentId) =>
        axiosInstance.get(`/logbook/student/${studentId}`),

    // Review logbook (supervisor only)
    reviewLogbook: (logbookId, data) =>
        axiosInstance.put(`/logbook/review/${logbookId}`, data),

    // Get supervisor's assigned logbooks
    getSupervisorLogbooks: () =>
        axiosInstance.get('/logbook/supervisor'),

    // Update logbook entry
    updateEntry: (logbookId, data) =>
        axiosInstance.put(`/logbook/${logbookId}`, data),

    // Delete logbook entry
    deleteEntry: (logbookId) =>
        axiosInstance.delete(`/logbook/${logbookId}`),

    // Get logbook by ID
    getById: (logbookId) =>
        axiosInstance.get(`/logbook/${logbookId}`),
};

// Assignment Api
export const assignmentAPI = {
    // Assign student to supervisor (HOD only)
    assignStudent: (data) =>
        axiosInstance.post('/assignments/assign', data),

    // Get departmental assignments (HOD only)
    getDepartmental: () =>
        axiosInstance.get('/assignments/department'),

    // Get supervisor's assigned students
    getSupervisorStudents: () =>
        axiosInstance.get('/assignments/my-students'),

    // Update assignment
    updateAssignment: (assignmentId, data) =>
        axiosInstance.put(`/assignments/${assignmentId}`, data),

    // Delete assignment
    deleteAssignment: (assignmentId) =>
        axiosInstance.delete(`/assignments/${assignmentId}`),

    // Get all assignments
    getAll: () =>
        axiosInstance.get('/assignments'),
};

// Grading Api
export const gradingAPI = {
    // Schedule defense (coordinator only)
    scheduleDefense: (data) =>
        axiosInstance.post('/grading/schedule', data),

    // Submit grade (coordinator only)
    submitGrade: (data) =>
        axiosInstance.post('/grading/submit', data),

    // Get all defenses (coordinator only)
    getAllDefenses: () =>
        axiosInstance.get('/grading/all'),

    // Get student's own defense info
    getMyDefense: () =>
        axiosInstance.get('/grading/my-defense'),

    // Get specific student's defense info
    getStudentDefense: (studentId) =>
        axiosInstance.get(`/grading/student/${studentId}`),

    // Update defense
    updateDefense: (defenseId, data) =>
        axiosInstance.put(`/grading/${defenseId}`, data),

    // Delete defense
    deleteDefense: (defenseId) =>
        axiosInstance.delete(`/grading/${defenseId}`),
};

// Verification Code Api
export const verificationAPI = {
    // Generate verification code (coordinator only)
    generateCode: (data) =>
        axiosInstance.post('/verification/generate', data),

    // Verify code (public)
    verifyCode: (data) =>
        axiosInstance.post('/verification/verify', data),

    // Get all codes (coordinator only)
    getAllCodes: () =>
        axiosInstance.get('/verification'),

    // Get unused codes by department
    getUnusedCodes: (department) =>
        axiosInstance.get(`/verification/unused/${department}`),

    // Delete verification code
    deleteCode: (codeId) =>
        axiosInstance.delete(`/verification/${codeId}`),

    // Resend verification code email
    resendCode: (codeId) =>
        axiosInstance.post(`/verification/resend/${codeId}`),
};

// Institution Supervisor Api
export const institutionSupervisorAPI = {
    // Get all institution supervisors
    getAll: () =>
        axiosInstance.get('/institution-supervisors'),

    // Create institution supervisor
    create: (data) =>
        axiosInstance.post('/institution-supervisors', data),

    // Get by ID
    getById: (id) =>
        axiosInstance.get(`/institution-supervisors/${id}`),

    // Update supervisor
    update: (id, data) =>
        axiosInstance.put(`/institution-supervisors/${id}`, data),

    // Delete supervisor
    delete: (id) =>
        axiosInstance.delete(`/institution-supervisors/${id}`),
};

// Industry Supervisor Api
export const industrySupervisorAPI = {
    // Get all industry supervisors
    getAll: () =>
        axiosInstance.get('/industry-supervisors'),

    // Create industry supervisor
    create: (data) =>
        axiosInstance.post('/industry-supervisors', data),

    // Get by ID
    getById: (id) =>
        axiosInstance.get(`/industry-supervisors/${id}`),

    // Update supervisor
    update: (id, data) =>
        axiosInstance.put(`/industry-supervisors/${id}`, data),

    // Delete supervisor
    delete: (id) =>
        axiosInstance.delete(`/industry-supervisors/${id}`),
};

// HOD Api
export const hodAPI = {
    // Get all HODs
    getAll: () =>
        axiosInstance.get('/hods'),

    // Create HOD
    create: (data) =>
        axiosInstance.post('/hods', data),

    // Get by ID
    getById: (id) =>
        axiosInstance.get(`/hods/${id}`),

    // Update HOD
    update: (id, data) =>
        axiosInstance.put(`/hods/${id}`, data),

    // Delete HOD
    delete: (id) =>
        axiosInstance.delete(`/hods/${id}`),

    // Get HOD dashboard stats
    getDashboardStats: () =>
        axiosInstance.get('/hods/dashboard/stats'),
};

// Coordinator Api
export const coordinatorAPI = {
    // Get all coordinators
    getAll: () =>
        axiosInstance.get('/siwes-coordinators'),

    // Create coordinator
    create: (data) =>
        axiosInstance.post('/siwes-coordinators', data),

    // Get by ID
    getById: (id) =>
        axiosInstance.get(`/siwes-coordinators/${id}`),

    // Update coordinator
    update: (id, data) =>
        axiosInstance.put(`/siwes-coordinators/${id}`, data),

    // Delete coordinator
    delete: (id) =>
        axiosInstance.delete(`/siwes-coordinators/${id}`),

    // Get coordinator dashboard stats
    getDashboardStats: () =>
        axiosInstance.get('/siwes-coordinators/dashboard/stats'),
};

// Letter Api
export const letterAPI = {
    // Upload letter
    upload: (data) =>
        axiosInstance.post('/letters', data),

    // Get all letters
    getAll: () =>
        axiosInstance.get('/letters'),

    // Get student letters
    getStudentLetters: (studentId) =>
        axiosInstance.get(`/letters/student/${studentId}`),

    // Get letter by ID
    getById: (letterId) =>
        axiosInstance.get(`/letters/${letterId}`),

    // Delete letter
    delete: (letterId) =>
        axiosInstance.delete(`/letters/${letterId}`),

    // Download letter
    download: (letterId) =>
        axiosInstance.get(`/letters/download/${letterId}`, {
            responseType: 'blob'
        }),
};

// Report Api
export const reportAPI = {
    // Generate student report
    generateStudentReport: (studentId) =>
        axiosInstance.get(`/reports/student/${studentId}`, {
            responseType: 'blob'
        }),

    // Generate department report
    generateDepartmentReport: (department) =>
        axiosInstance.get(`/reports/department/${department}`, {
            responseType: 'blob'
        }),

    // Generate all students report
    generateAllStudentsReport: () =>
        axiosInstance.get('/reports/all-students', {
            responseType: 'blob'
        }),

    // Get logbook statistics
    getLogbookStats: () =>
        axiosInstance.get('/reports/logbook-stats'),

    // Get defense statistics
    getDefenseStats: () =>
        axiosInstance.get('/reports/defense-stats'),
};

// Dashboard Api
export const dashboardAPI = {
    // Get student dashboard data
    getStudentDashboard: () =>
        axiosInstance.get('/dashboard/student'),

    // Get supervisor dashboard data
    getSupervisorDashboard: () =>
        axiosInstance.get('/dashboard/supervisor'),

    // Get HOD dashboard data
    getHodDashboard: () =>
        axiosInstance.get('/dashboard/hod'),

    // Get coordinator dashboard data
    getCoordinatorDashboard: () =>
        axiosInstance.get('/dashboard/coordinator'),
};

// Combined Api object for easy importing
const Api = {
    auth: authAPI,
    students: studentAPI,
    logbook: logbookAPI,
    assignments: assignmentAPI,
    grading: gradingAPI,
    verification: verificationAPI,
    institutionSupervisors: institutionSupervisorAPI,
    industrySupervisors: industrySupervisorAPI,
    hods: hodAPI,
    coordinators: coordinatorAPI,
    letters: letterAPI,
    reports: reportAPI,
    dashboard: dashboardAPI,
};

export default Api;