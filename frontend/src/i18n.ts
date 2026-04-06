export type Language = 'vi' | 'en';

export interface TranslationSchema {
  nexusChat: string;
  prodManagement: string;
  prodTime: string;
  cskh: string;
  teleData: string;
  accHr: string;
  payroll: string;
  sysAdmin: string;
  accManagement: string;
  logout: string;
  profile: string;
  searchPlaceholder: string;
  themeLight: string;
  themeDark: string;
  langVi: string;
  langEn: string;
  chatPlaceholder: string;
  agentThinking: string;
  typing: string;
  welcome: string;
  adminUsersTitle: string;
  adminUsersSubtitle: string;
  username: string;
  role: string;
  status: string;
  telegramId: string;
  createdAt: string;
  actions: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  loading: string;
  noData: string;
  active: string;
  suspended: string;
  adminRole: string;
  userRole: string;
  notLinked: string;
  editUserTitle: string;
  accountStatus: string;
  adminTeleTitle: string;
  adminTeleSubtitle: string;
  groupName: string;
  members: string;
  lastActive: string;
  viewDetails: string;
  noGroups: string;
  backToGroups: string;
  memberDetails: string;
  interactionHistory: string;
  noHistory: string;
  adminEmpTitle: string;
  adminEmpSubtitle: string;
  empName: string;
  position: string;
  department: string;
  salary: string;
  allowance: string;
  noEmpData: string;
  syncNexus: string;
  editEmp: string;
  empPosition: string;
  contractSalary: string;
  allowanceFuel: string;
  allowanceMeal: string;
  allowanceOther: string;
  posDirector: string;
  posSales: string;
  posDev: string;
  posAccountant: string;
  posProd: string;
  posMarketing: string;
  adminProdTitle: string;
  adminProdSubtitle: string;
  minEstimate: string;
  maxEstimate: string;
  synchronize: string;
  days: string;
  stable: string;
  fast: string;
  ready: string;
  systemNodes: string;
  avgLatency: string;
  agentSync: string;
  logicAnalysis: string;
  prodLogicInfo: string;
  prodLogicFormula: string;
  prodLogicNote: string;
  profileTitle: string;
  personalInfo: string;
  security: string;
  saveChanges: string;
  changePassword: string;
  profileUpdateSuccess: string;
  login: string;
  register: string;
  welcomeBack: string;
  getStarted: string;
  noAccount: string;
  hasAccount: string;
  category: string;
  botGreeting: string;
  lastUpdate: string;
  viewMembers: string;
  membersOf: string;
  noMembers: string;
  back: string;
  displayName: string;
  lastInteraction: string;
  newUserGreeting: string;
  joinDate: string;
  updateError?: string;
  deleteAdminError?: string;
  deleteConfirm: string;
  deleteError?: string;
  loadHistoryError?: string;
  updateProdError?: string;
  connError?: string;
  updated_at: string;
  synchronized: string;
  saving: string;
  password: string;
  loginSystem: string;
  createAccount: string;
  speechNotSupported: string;
  listening: string;
  handsFreeLabel: string;
  liveLabel: string;
  handsFreeOff: string;
  handsFreeOn: string;
  handsFreeActive: string;
  handsFree: string;
  ttsOff: string;
  ttsOn: string;
  loadingHistory: string;
}

export const translations: Record<Language, TranslationSchema> = {
  vi: {
    // Sidebar & Navigation
    nexusChat: 'Hội thoại Nexus',
    prodManagement: 'Quản lý Sản xuất',
    prodTime: 'Thời gian sản xuất',
    cskh: 'Chăm sóc Khách hàng',
    teleData: 'Dữ liệu Telegram',
    accHr: 'Kế toán & Nhân sự',
    payroll: 'Bảng lương nhân sự',
    sysAdmin: 'Quản trị Hệ thống',
    accManagement: 'Quản lý Tài khoản',
    logout: 'Đăng xuất hệ thống',
    profile: 'Trang cá nhân',

    // TopBar
    searchPlaceholder: 'Tìm kiếm dữ liệu...',
    themeLight: 'Giao diện Sáng',
    themeDark: 'Giao diện Tối',
    langVi: 'Tiếng Việt',
    langEn: 'English',

    // Chat
    chatPlaceholder: 'Nhập nội dung hội thoại...',
    agentThinking: 'Agent đang phân tích...',
    botGreeting: 'Chào mừng trở lại! Tôi có thể giúp gì cho bạn?',
    newUserGreeting: 'Chào mừng! Bạn cần hỗ trợ gì từ Hệ sinh thái Agent hôm nay?',
    typing: 'đang nhập...',
    welcome: 'Chào mừng',

    // Common
    actions: 'Hành động',
    edit: 'Sửa',
    delete: 'Xóa',
    status: 'Trạng thái',
    loading: 'Đang tải...',
    noData: 'Không tìm thấy dữ liệu.',
    createdAt: 'Ngày tạo',

    // Admin Users
    adminUsersTitle: 'Quản lý Tài khoản',
    adminUsersSubtitle: 'DANH SÁCH NGƯỜI DÙNG & PHÂN QUYỀN HỆ THỐNG NEXUS AI',
    username: 'Tài khoản',
    role: 'Phân quyền',
    telegramId: 'Telegram ID',
    joinDate: 'Ngày tham gia',
    active: 'Hoạt động',
    suspended: 'Đình chỉ',
    notLinked: 'Chưa liên kết',
    editUserTitle: 'Cấu hình người dùng:',
    userRole: 'Thành viên',
    adminRole: 'Quản trị viên',
    accountStatus: 'Trạng thái tài khoản',
    save: 'Lưu thay đổi',
    cancel: 'Hủy',
    updateError: 'Lỗi cập nhật người dùng',
    deleteAdminError: 'Không thể xóa tài khoản admin gốc!',
    deleteConfirm: 'Bạn có chắc chắn muốn xóa người dùng',
    deleteError: 'Lỗi khi xóa người dùng',

    // Admin Telegram
    adminTeleTitle: 'Dữ liệu Telegram',
    adminTeleSubtitle: 'GIÁM SÁT HOẠT ĐỘNG NEXUS TRÊN CÁC NHÓM CHAT DOANH NGHIỆP',
    groupName: 'Tên Nhóm / Cuộc trò chuyện',
    category: 'Thể loại',
    lastUpdate: 'Cập nhật gần nhất',
    members: 'Thành viên',
    lastActive: 'Hoạt động cuối',
    viewDetails: 'Chi tiết',
    noGroups: 'Chưa có nhóm nào. Vui lòng thêm bot vào nhóm Telegram và nhắn tin.',
    backToGroups: 'Quay lại danh sách nhóm',
    memberDetails: 'Thông tin thành viên',
    interactionHistory: 'Lịch sử tương tác',
    noHistory: 'Chưa có lịch sử tương tác.',
    viewMembers: 'Xem thành viên',
    membersOf: 'Thành viên:',
    back: 'Quay về',
    displayName: 'Tên hiển thị',
    lastInteraction: 'Lần cuối tương tác',
    noMembers: 'Nhóm này chưa ghi nhận thành viên nào ngoài Bot.',

    // Admin Employees
    adminEmpTitle: 'Quản lý Nhân sự',
    adminEmpSubtitle: 'HỆ THỐNG ĐIỀU HÀNH & QUẢN TRỊ NGUỒN LỰC NEXUS',
    empName: 'Họ và tên',
    position: 'Chức vụ',
    department: 'Team',
    salary: 'Lương HĐ',
    allowance: 'Phụ cấp',
    noEmpData: 'Không có dữ liệu nhân sự.',
    syncNexus: 'Cập nhật dữ liệu từ Nexus Core...',
    editEmp: 'Chỉnh sửa:',
    empPosition: 'Chức vụ',
    contractSalary: 'Lương theo HĐ',
    allowanceFuel: 'Phụ cấp Xăng/ĐT',
    allowanceMeal: 'Phụ cấp Ăn ca',
    allowanceOther: 'Phụ cấp khác',
    posDirector: 'Giám đốc',
    posSales: 'Nhân viên Kinh doanh',
    posDev: 'Nhân viên Phần mềm',
    posAccountant: 'Kế toán',
    posProd: 'Sản xuất',
    posMarketing: 'Marketing',

    // Admin Production
    adminProdTitle: 'Production Core',
    adminProdSubtitle: 'TÙY CHỈNH THÔNG SỐ VẬN HÀNH HỆ THỐNG AGENT (KERNEL V1.0)',
    minEstimate: 'DỰ KIẾN TỐI THIỂU',
    maxEstimate: 'DỰ KIẾN TỐI ĐA',
    synchronize: 'ĐỒNG BỘ HỆ THỐNG',
    days: 'NGÀY',
    stable: 'ỔN ĐỊNH',
    fast: 'NHANH',
    ready: 'SẴN SÀNG',
    systemNodes: 'NÚT HỆ THỐNG',
    avgLatency: 'ĐỘ TRỄ TRUNG BÌNH',
    agentSync: 'ĐỒNG BỘ AGENT',
    logicAnalysis: 'PHÂN TÍCH LOGIC NEURAL',
    prodLogicInfo: 'Thời gian sản xuất này được nạp trực tiếp vào System Prompt của Agent.',
    prodLogicNote: '* Lưu ý: Thuật toán tự động bỏ qua các ngày nghỉ lễ và cuối tuần.',
    prodLogicFormula: 'Agent sẽ tính toán: [Gửi in] + [Số ngày cài đặt] = [Ngày dự kiến có Tracking].',

    // User Profile
    profileTitle: 'Hồ sơ người dùng',
    personalInfo: 'Thông tin cá nhân',
    security: 'Bảo mật & Hệ thống',
    updated_at: 'Cập nhật:',
    synchronized: 'Đã đồng bộ!',
    saveChanges: 'Lưu thay đổi',
    changePassword: 'Đổi mật khẩu',
    profileUpdateSuccess: 'Thông tin đã được cập nhật trên hệ thống Nexus Core.',
    saving: 'Đang lưu...',
    password: 'Mật khẩu',
    loginSystem: 'Đăng nhập Hệ Thống',
    createAccount: 'Khởi Tạo Tài Khoản',
    speechNotSupported: 'Trình duyệt không hỗ trợ Speech Recognition. Vui lòng dùng Chrome.',
    listening: 'Đang lắng nghe...',
    handsFreeLabel: 'RẢNH TAY',
    liveLabel: 'TRỰC TIẾP',
    handsFreeOff: 'Tắt chế độ rảnh tay',
    handsFreeOn: 'Bật chế độ rảnh tay',
    handsFreeActive: 'Chế độ rảnh tay đang bật...',
    handsFree: 'Rảnh tay',
    ttsOff: 'Tắt đọc tự động',
    ttsOn: 'Bật đọc tự động',
    loadingHistory: 'Đang tải lịch sử hội thoại...',

    // Auth
    login: 'Đăng nhập',
    register: 'Đăng ký',
    welcomeBack: 'Chào mừng trở lại',
    getStarted: 'Bắt đầu ngay',
    noAccount: 'Chưa có tài khoản?',
    hasAccount: 'Đã có tài khoản?'
  },
  en: {
    // Sidebar & Navigation
    nexusChat: 'Nexus Conversation',
    prodManagement: 'Production Mgt',
    prodTime: 'Production Timeline',
    cskh: 'Customer Support',
    teleData: 'Telegram Analytics',
    accHr: 'HR & Accounting',
    payroll: 'Staff Payroll',
    sysAdmin: 'System Admin',
    accManagement: 'Account Control',
    logout: 'Sign Out System',
    profile: 'User Profile',

    // TopBar
    searchPlaceholder: 'Search for data...',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',
    langVi: 'Tiếng Việt',
    langEn: 'English',

    // Chat
    chatPlaceholder: 'Type your message...',
    agentThinking: 'Agent is thinking...',
    botGreeting: 'Welcome back! How can I help you today?',
    newUserGreeting: 'Welcome! How can I assist you with the Agent Ecosystem today?',
    typing: 'typing...',
    welcome: 'Welcome',

    // Common
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    status: 'Status',
    loading: 'Loading...',
    noData: 'No data found.',
    createdAt: 'Created At',

    // Admin Users
    adminUsersTitle: 'Account Management',
    adminUsersSubtitle: 'USER LIST & SYSTEM ROLE ASSIGNMENT',
    username: 'Account',
    role: 'Role',
    telegramId: 'Telegram ID',
    joinDate: 'Joined Date',
    active: 'Active',
    suspended: 'Suspended',
    notLinked: 'Not linked',
    editUserTitle: 'User Config:',
    userRole: 'User',
    adminRole: 'Admin',
    accountStatus: 'Account Status',
    save: 'Save Changes',
    cancel: 'Cancel',
    deleteAdminError: 'Cannot delete root admin!',
    deleteConfirm: 'Are you sure you want to delete user',
    deleteError: 'Delete failed',

    // Admin Telegram
    adminTeleTitle: 'Telegram Data',
    adminTeleSubtitle: 'MONITORING NEXUS ACTIVITY ACROSS BUSINESS GROUPS',
    groupName: 'Group / Chat Name',
    category: 'Category',
    lastUpdate: 'Last Updated',
    members: 'Members',
    lastActive: 'Last Active',
    viewDetails: 'View Details',
    noGroups: 'No groups yet. Please add bot to Telegram and send message.',
    backToGroups: 'Back to Group List',
    memberDetails: 'Member Details',
    interactionHistory: 'Interaction History',
    noHistory: 'No interaction history available.',
    viewMembers: 'View Members',
    membersOf: 'Members:',
    back: 'Back',
    displayName: 'Display name',
    lastInteraction: 'Last Interaction',
    noMembers: 'No members recorded in this group besides Bot.',

    // Admin Employees
    adminEmpTitle: 'HR Management',
    adminEmpSubtitle: 'OPERATING SYSTEM & RESOURCE ADMINISTRATION',
    empName: 'Full Name',
    position: 'Position',
    department: 'Team',
    salary: 'Base Salary',
    allowance: 'Allowance',
    noEmpData: 'No employee data found.',
    syncNexus: 'Synchronizing from Nexus Core...',
    editEmp: 'Edit Employee:',
    empPosition: 'Position',
    contractSalary: 'Contract Salary',
    allowanceFuel: 'Fuel/Phone Allowance',
    allowanceMeal: 'Meal Allowance',
    allowanceOther: 'Other Allowance',
    posDirector: 'Director',
    posSales: 'Sales Representative',
    posDev: 'Software Engineer',
    posAccountant: 'Accountant',
    posProd: 'Production Staff',
    posMarketing: 'Marketing specialist',

    // Admin Production
    adminProdTitle: 'Production Core',
    adminProdSubtitle: 'CUSTOMIZE AGENT SYSTEM PARAMETERS (KERNEL V1.0)',
    minEstimate: 'MIN ESTIMATE',
    maxEstimate: 'MAX ESTIMATE',
    synchronize: 'SYNCHRONIZE SYSTEM',
    days: 'DAYS',
    stable: 'STABLE',
    fast: 'FAST',
    ready: 'READY',
    systemNodes: 'SYSTEM NODES',
    avgLatency: 'AVG LATENCY',
    agentSync: 'AGENT SYNC',
    logicAnalysis: 'LOGIC NEURAL ANALYSIS',
    prodLogicInfo: 'These production times are injected directly into the Agent System Prompt.',
    prodLogicNote: '* Note: Algorithms automatically bypass holidays and weekends.',
    prodLogicFormula: 'Agent calculates: [Sent to Print] + [Config Days] = [Expected Delivery Date].',

    // User Profile
    profileTitle: 'User Profile',
    personalInfo: 'Personal Information',
    security: 'Security & System',
    updated_at: 'Updated:',
    synchronized: 'Synchronized!',
    saveChanges: 'Save Changes',
    changePassword: 'Change Password',
    profileUpdateSuccess: 'Information has been updated on Nexus Core system.',
    saving: 'Saving...',
    password: 'Password',
    loginSystem: 'Log In System',
    createAccount: 'Create Account',
    speechNotSupported: 'Browser does not support Speech Recognition. Please use Chrome.',
    listening: 'Listening...',
    handsFreeLabel: 'HANDS-FREE',
    liveLabel: 'LIVE',
    handsFreeOff: 'Hands-free Off',
    handsFreeOn: 'Hands-free On',
    handsFreeActive: 'Hands-free active...',
    handsFree: 'Hands-free',
    ttsOff: 'TTS Off',
    ttsOn: 'TTS On',

    // Auth
    login: 'Log In',
    register: 'Register',
    welcomeBack: 'Welcome Back',
    getStarted: 'Get Started',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    loadingHistory: 'Loading conversation history...',
    updateError: 'Update failed!',
    loadHistoryError: 'Failed to load chat history.',
    updateProdError: 'Production update failed!',
    connError: 'Lost connection to production server (EFS Node 1).'
  }
};
